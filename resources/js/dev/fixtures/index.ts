import type * as React from 'react';

export interface FixtureState {
    label: string;
    render: () => React.ReactNode;
}

export interface FixtureDefinition {
    id: string;
    title: string;
    states: FixtureState[];
}

const registry = new Map<string, FixtureDefinition>();

export function register(fixture: FixtureDefinition): FixtureDefinition {
    registry.set(fixture.id, fixture);
    return fixture;
}

export function getFixtures(): FixtureDefinition[] {
    return Array.from(registry.values());
}
