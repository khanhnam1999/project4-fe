<template>
    <a-card title="ĐẶT LẠI MẬT KHẨU" style="width: 600px">
        <template #extra>
            <router-link to="/login">
                <a-button type="link">Đăng nhập</a-button>
            </router-link>
        </template>
        <a-steps
            :items="[
                { title: 'Điền số căn cước' },
                { title: 'Xác thực' },
                { title: 'Đặt lại mật khẩu' },
            ]"
            :current="current"
        />
        <div style="margin-top: 16px">
            <template v-if="current === 0">
                <a-form-item v-bind="validateInfos.identityNumber">
                    <a-row :gutter="8">
                        <a-col :span="16">
                            <a-input
                                placeholder="Số căn cước phải là 12 chữ số"
                                v-model:value="formState.identityNumber"
                                :maxlength="12"
                                @keypress="InputService.onlyNumber"
                                allowClear
                            />
                        </a-col>
                        <a-col :span="8">
                            <a-button
                                type="primary"
                                block
                                @click="handleSubmit"
                                :loading="loading"
                            >
                                Xác nhận
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form-item>
            </template>
            <template v-if="current === 1">
                <div>
                    <a-typography-paragraph>
                        Mã OTP sẽ được gửi vào Email:
                        <a-typography-text strong>
                            {{ email }}
                        </a-typography-text>
                    </a-typography-paragraph>
                    <a-typography-paragraph>
                        Xin hãy nhập mã để đặt mật khẩu.
                    </a-typography-paragraph>
                    <a-form-item>
                        <div
                            style="
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            "
                        >
                            <a-space>
                                <a-input
                                    style="width: 32px"
                                    :maxlength="1"
                                    v-for="(i, index) in 6"
                                    :key="i"
                                    v-model:value="otp[index]"
                                    @keypress="InputService.onlyNumber"
                                    @change="
                                        (event) => handleChangeOtp(event, index)
                                    "
                                    :ref="(el) => setInputRef(el, index)"
                                    :disabled="timeLeft === 0"
                                />
                            </a-space>
                        </div>
                    </a-form-item>
                    <a-form-item>
                        <div style="display: flex; justify-content: center">
                            <a-button
                                type="primary"
                                :disabled="timeLeft === 0"
                                @click="verifyOtp"
                            >
                                Xác thực
                            </a-button>
                        </div>
                    </a-form-item>
                    <div style="display: flex; justify-content: end">
                        <a-space>
                            OTP còn hiệu lực:
                            <b>{{ showTimeLeft }}</b>
                            <a-button
                                type="link"
                                :disabled="timeLeft !== 0"
                                @click="requestOtp"
                            >
                                Lấy lại mã otp
                            </a-button>
                        </a-space>
                    </div>
                </div>
            </template>
            <template v-if="current === 2">
                <a-form-item v-bind="pwdValidateInfo.password">
                    <a-input-password
                        placeholder="Nhập mật khẩu mới"
                        v-model:value="pwdFormState.password"
                    />
                </a-form-item>
                <a-form-item v-bind="pwdValidateInfo.confirmPassword">
                    <a-input-password
                        placeholder="Nhập lại mật khẩu"
                        v-model:value="pwdFormState.confirmPassword"
                    />
                </a-form-item>
                <a-form-item>
                    <a-button
                        block
                        type="primary"
                        @click="handleSubmitPwd"
                        :loading="pwdLoading"
                    >
                        Đặt mật khẩu
                    </a-button>
                </a-form-item>
            </template>
        </div>
    </a-card>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { InputService } from "../../services/input.service";
import { Form, message } from "ant-design-vue";
import api from "../../middleware/axios.interceptor";
import { RuleObject, StoreValue } from "ant-design-vue/es/form/interface";
import { useRouter } from "vue-router";
import { HashPwdService } from "../../services/hashPwd.service";

const router = useRouter();
const useForm = Form.useForm;

const current = ref<number>(0);

const loading = ref<boolean>(false);

const formState = reactive({
    identityNumber: "",
});

const email = ref<string>("");

const otp = ref<number[]>([]);

const inputRefs = ["inputA", "inputB", "inputC", "inputD", "inputE", "inputF"];
// Hàm này sẽ được Vue gọi tự động khi render phần tử
const setInputRef = (el: any, index: number) => {
    if (el) {
        inputRefs[index] = el;
    }
};

const handleChangeOtp = (event: any, index: number) => {
    if (index !== inputRefs.length - 1 && event.data !== null) {
        inputRefs[index + 1].focus();
    }
};

const timeLeft = ref(5 * 60); // 5 phút = 300 giây

function startCountdown() {
    let timer = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            clearInterval(timer);
        }
    }, 1000);
}

const showTimeLeft = computed(() => {
    const m = Math.floor(timeLeft.value / 60);
    const s = timeLeft.value % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
});

const rules = reactive({
    identityNumber: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập số căn cước",
        },
        {
            pattern: /^[0-9]{12}$/,
            message: "Căn cước là số có đủ 12 số",
        },
    ],
});

const { validate, validateInfos } = useForm(formState, rules);

const handleSubmit = () => {
    loading.value = true;
    validate()
        .then(() => {
            api.get(`/Accounts/checkAccount/${formState.identityNumber}`)
                .then((res) => {
                    current.value = 1;
                    email.value = res.data;
                    requestOtp();
                })
                .catch((err: any) => {
                    console.log(err);
                    message.error("Không tìm thấy tài khoản");
                });
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });
};

const requestOtp = () => {
    api.get(`Accounts/requestOtp/${email.value}`)
        .then(() => {
            startCountdown();
        })
        .catch((err) => console.log(err));
};

const verifyOtp = () => {
    const otpValue = otp.value.join("");
    api.post("/Accounts/verifyOtp", {
        email: email.value,
        otp: otpValue,
    })
        .then((res) => {
            current.value = 2;
        })
        .catch((err) => console.log(err));
};

const pwdFormState = reactive({
    password: "",
    confirmPassword: "",
});

const pwdRules = reactive({
    password: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập mật khẩu",
        },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        },
    ],
    confirmPassword: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập lại đúng mật khẩu",
        },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        },
        {
            validator(_: RuleObject, value: StoreValue) {
                if (!value || value === pwdFormState.password) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp"),
                );
            },
        },
    ],
});

const { validate: pwdValidate, validateInfos: pwdValidateInfo } = useForm(
    pwdFormState,
    pwdRules,
);

const pwdLoading = ref<boolean>(false);

const handleSubmitPwd = () => {
    pwdLoading.value = true;
    pwdValidate()
        .then(() => {
            api.post(`/Accounts/setPwd`, {
                identityNumber: formState.identityNumber,
                email: email.value,
                password: HashPwdService.hashedPassword(pwdFormState.password),
            })
                .then((res) => {
                    message.success("Thay đổi mật khẩu thành công");
                    router.push("/login");
                })
                .catch((err: any) => {
                    console.log(err);
                    message.error("Không tìm thấy tài khoản");
                });
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            pwdLoading.value = false;
        });
};
</script>
