import type { LucideIcon, LucideProps } from 'lucide-react';
import {
    ArrowLeftRight,
    ArrowRight,
    Ban,
    Building2,
    CalendarDays,
    ChartNoAxesColumn,
    Check,
    ChevronDown,
    CircleAlert,
    Clock,
    Copy,
    CreditCard,
    Download,
    Ellipsis,
    Eye,
    EyeOff,
    FileText,
    Gift,
    Globe,
    Hourglass,
    Inbox,
    Info,
    KeyRound,
    LayoutGrid,
    Link2,
    ListFilter,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Monitor,
    Moon,
    PenLine,
    Phone,
    Plus,
    Printer,
    QrCode,
    Receipt,
    RefreshCw,
    Search,
    Send,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    StickyNote,
    Sun,
    Trash2,
    Upload,
    User,
    Users,
    Video,
    X,
} from 'lucide-react';

export const ICON_MAP = {
    check: Check,
    arrow: ArrowRight,
    chev: ChevronDown,
    grid: LayoutGrid,
    doc: FileText,
    cal: CalendarDays,
    msg: MessageSquare,
    gift: Gift,
    shield: ShieldCheck,
    pen: PenLine,
    upload: Upload,
    download: Download,
    card: CreditCard,
    phone: Phone,
    video: Video,
    building: Building2,
    clock: Clock,
    lock: Lock,
    key: KeyRound,
    logout: LogOut,
    sun: Sun,
    moon: Moon,
    monitor: Monitor,
    menu: Menu,
    send: Send,
    receipt: Receipt,
    hourglass: Hourglass,
    trash: Trash2,
    eye: Eye,
    eyeoff: EyeOff,
    copy: Copy,
    users: Users,
    user: User,
    inbox: Inbox,
    search: Search,
    filter: ListFilter,
    funnel: ListFilter,
    plus: Plus,
    x: X,
    dots: Ellipsis,
    alert: CircleAlert,
    info: Info,
    printer: Printer,
    link: Link2,
    mail: Mail,
    pin: MapPin,
    sliders: SlidersHorizontal,
    globe: Globe,
    spark: Sparkles,
    swap: ArrowLeftRight,
    bars: ChartNoAxesColumn,
    note: StickyNote,
    ban: Ban,
    refresh: RefreshCw,
    qr: QrCode,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;

export type AppIconProps = Omit<LucideProps, 'size'> & {
    name: IconName;
    size?: number;
};

export function AppIcon({
    name,
    size = 18,
    strokeWidth = 1.7,
    ...props
}: AppIconProps) {
    const IconComponent = ICON_MAP[name];

    return (
        <IconComponent
            size={size}
            strokeWidth={strokeWidth}
            aria-hidden={props['aria-label'] ? undefined : true}
            {...props}
        />
    );
}
