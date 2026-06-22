import SHA256 from "crypto-js/sha256";

export const HashPwdService = {
    hashedPassword(password: string) {        
        return SHA256(password).toString();
    }
}