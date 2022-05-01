export interface ContactDB {
    id: number;
    type: "Phone" | "Email" | "Facebook" | "Line" | "Instagram" | "Website" | "Discord" | "Other";
    name: string;
    value: string;
}

