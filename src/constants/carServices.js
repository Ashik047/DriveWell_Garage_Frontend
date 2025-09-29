import {
    WrenchIcon,
    GaugeIcon,
    BatteryChargingIcon,
    ShieldIcon,
    CarIcon,
    SparklesIcon,
    AirVentIcon,
    WifiIcon,
    Droplet,
    CircleDot
} from 'lucide-react'

export const services = [
    {
        id: 1,
        name: "Oil Change",
        icon: Droplet,
        description: "Regular oil changes to keep your engine running smoothly and extend its lifespan.",
        price: 29.99,
    },
    {
        id: 2,
        name: "Engine Diagnostics",
        icon: GaugeIcon,
        description: "Advanced computer diagnostics to identify engine issues and performance problems.",
        price: 49.99,
    },
    {
        id: 3,
        name: "Tire Replacement",
        icon: CircleDot,
        description: "Quality tire replacement, rotation, and balancing services for a smoother ride.",
        price: 79.99,
    },
    {
        id: 4,
        name: "Battery Service",
        icon: BatteryChargingIcon,
        description: "Battery testing, replacement, and electrical system checks to prevent starting issues.",
        price: 59.99,
    },
    {
        id: 5,
        name: "Brake Service",
        icon: ShieldIcon,
        description: "Comprehensive brake inspection, pad replacement, and rotor resurfacing for safety.",
        price: 89.99,
    },
    {
        id: 6,
        name: "Transmission Service",
        icon: CarIcon,
        description: "Transmission fluid change, filter replacement, and system inspection for smooth shifting.",
        price: 119.99,
    },
    {
        id: 7,
        name: "Air Conditioning",
        icon: AirVentIcon,
        description: "AC system diagnosis, refrigerant recharge, and component repair for cool comfort.",
        price: 69.99,
    },
    {
        id: 8,
        name: "Computer Systems",
        icon: WifiIcon,
        description: "Advanced diagnostics and repair of vehicle computer and electronic systems.",
        price: 99.99,
    },
    {
        id: 9,
        name: "Detailing Services",
        icon: SparklesIcon,
        description: "Interior and exterior cleaning, polishing, and protection for a showroom finish.",
        price: 149.99,
    },
    {
        id: 10,
        name: "General Maintenance",
        icon: WrenchIcon,
        description: "Comprehensive vehicle maintenance including fluids, filters, and inspections.",
        price: 99.99,
    }
];