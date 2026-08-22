export type ID = string;

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Status = "idle" | "loading" | "success" | "error";

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type SelectOption<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};
