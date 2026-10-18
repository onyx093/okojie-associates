import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Mail, Phone, Search, Shield, User as UserIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';

interface ClientItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    tier: string | null;
    tierLabel: string;
    returnStatus: string | null;
    returnStatusLabel: string;
    preparerName: string;
    preparerId: number | null;
    invoiceStatus: string | null;
    invoiceAmount: string;
    createdAt: string;
}

interface ClientsProps {
    clients: {
        data: ClientItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        search: string;
    };
    isPreparer: boolean;
}

export default function Clients({ clients, filters, isPreparer }: ClientsProps) {
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clients', { search: searchTerm }, { preserveState: true });
    };

    const getStatusVariant = (status: string | null) => {
        switch (status) {
            case 'e_filed':
                return 'default';
            case 'e_signed':
            case 'ready_for_review':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AdminLayout title="Clients Directory">
            <Head title="Admin - Clients" />

            <div className="space-y-6">
                {/* Search Bar & Header */}
                <Card className="border-border bg-card">
                    <CardHeader className="py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    {isPreparer ? 'Your Assigned Clients' : 'All Clients'}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {clients.total} registered taxpayer account{clients.total === 1 ? '' : 's'}
                                </p>
                            </div>

                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <div className="relative w-64">
                                    <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search name, email, phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-8 pl-8 text-xs"
                                    />
                                </div>
                                <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs">
                                    Search
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                </Card>

                {/* Clients Table */}
                <Card className="border-border bg-card">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead>Taxpayer</TableHead>
                                        <TableHead>Service Tier</TableHead>
                                        <TableHead>Return Status</TableHead>
                                        <TableHead>Preparer</TableHead>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                                                No clients found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.data.map((client) => {
                                            return (
                                                <TableRow key={client.id} className="border-border">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                                                                {client.name
                                                                    ? client.name.charAt(0).toUpperCase()
                                                                    : client.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-foreground">
                                                                    {client.name || 'Unnamed Client'}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                    <Mail className="size-3" />
                                                                    {client.email}
                                                                </div>
                                                                {client.phone && (
                                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                        <Phone className="size-3" />
                                                                        {client.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {client.tierLabel}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant={getStatusVariant(client.returnStatus)}
                                                            className="text-xs font-medium"
                                                        >
                                                            {client.returnStatusLabel}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <span className="flex items-center gap-1.5 text-xs text-foreground">
                                                            <Shield className="size-3 text-muted-foreground" />
                                                            {client.preparerName}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="text-xs font-medium text-foreground">
                                                            {client.invoiceAmount}
                                                        </div>
                                                        {client.invoiceStatus && (
                                                            <div className="text-[10px] text-muted-foreground capitalize">
                                                                {client.invoiceStatus}
                                                            </div>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="outline" asChild className="h-8 text-xs">
                                                            <Link href={`/admin/clients/${client.id}`}>
                                                                Manage
                                                                <ArrowRight className="ml-1.5 size-3.5" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
