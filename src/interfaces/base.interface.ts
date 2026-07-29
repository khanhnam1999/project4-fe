export interface Condition {
    key: string;
    guidValue?: string;
    value?: string;
    incidentStatusValue?: number;
    paymentStatusValue?: number;
}
export interface Filter {
    page: number;
    limit: number;
    sortName: string;
    sortMethod: string;
    conditions: Condition[];
}

export type CollectionResponse<T> =
    | T[]
    | {
          $values?: T[];
          $id?: number | string;
      }
    | null
    | undefined;

export const getCollection = <T>(value: CollectionResponse<T>): T[] => {
    if (Array.isArray(value)) return value;
    return value?.$values ?? [];
};

export interface FilterResult<T> {
    results: CollectionResponse<T>;
    totalRecords: number;
}
