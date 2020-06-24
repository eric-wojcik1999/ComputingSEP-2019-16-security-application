export class Asset {

    constructor(
        public asset_name: string,
        public asset_sev_level: string,
        public asset_manager: string,
        public asset_origin: string,
        public asset_department: string,
        public asset_state: string, 
        public asset_type: string,
        public asset_subnet: string,
        public asset_assigned: string,
        public asset_est_worth: number,
        public asset_auth_users: string[],
        public asset_csv: string,
        public asset_report: string,
        public asset_company: string,
        public asset_criticality: string,
        public asset_platform: string,
        public asset_vul_tags: string[],
        public asset_patch: string,
        public asset_planned_actions: string,
        public asset_history: string,
        public asset_notes: string
    ) {}
}
