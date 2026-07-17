export interface Condition {
    key: string;
    guidValue?: string;
    value?: string;
    incidentStatusValue?: number;
}
export interface Filter {
    page: number;
    limit: number;
    sortName: string;
    sortMethod: string;
    conditions: Condition[];
}

export interface FilterResult<T> {
    results: {
        $values: T[];
        $id: number;
    };
    totalRecords: number;
}
