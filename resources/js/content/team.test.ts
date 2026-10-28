import { describe, expect, it } from 'vitest';
import { TEAM_MEMBERS } from './team';

describe('team content', () => {
    it('defines exactly four team members for the about showcase', () => {
        expect(TEAM_MEMBERS).toHaveLength(4);
    });

    it('each member has non-empty initials, name, role, office, and gradient', () => {
        for (const member of TEAM_MEMBERS) {
            expect(member.initials.length).toBeGreaterThanOrEqual(2);
            expect(member.name.trim().length).toBeGreaterThan(0);
            expect(member.role.trim().length).toBeGreaterThan(0);
            expect(member.office.trim().length).toBeGreaterThan(0);
            expect(member.gradient).toContain('linear-gradient');
        }
    });

    it('includes key founders and preparers matching mockup', () => {
        const names = TEAM_MEMBERS.map((m) => m.name);
        expect(names).toContain('Adaeze Okojie, EA');
        expect(names).toContain('Kofi Boateng');
        expect(names).toContain('Ngozi Mbah, EA');
        expect(names).toContain('Tobi Adeyemi');
    });
});
