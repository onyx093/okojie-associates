export interface TeamMember {
    initials: string;
    name: string;
    role: string;
    office: string;
    gradient: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    {
        initials: 'AO',
        name: 'Adaeze Okojie, EA',
        role: 'Enrolled Agent',
        office: 'Germantown Ave',
        gradient: 'linear-gradient(160deg in oklab, #C7D2FB, #F6C2A3)',
    },
    {
        initials: 'KB',
        name: 'Kofi Boateng',
        role: 'Senior preparer',
        office: 'Baltimore',
        gradient: 'linear-gradient(160deg in oklab, #B8E5A8, #A8C3FF)',
    },
    {
        initials: 'NM',
        name: 'Ngozi Mbah, EA',
        role: 'Small business',
        office: 'N. Broad St',
        gradient: 'linear-gradient(160deg in oklab, #FFD2A1, #F7A9C4)',
    },
    {
        initials: 'TA',
        name: 'Tobi Adeyemi',
        role: 'Client success',
        office: 'Chelten Ave',
        gradient: 'linear-gradient(160deg in oklab, #C9B8FF, #9FD5FF)',
    },
];
