export const links = [
    { name: 'departments.sales', link: '' },
    { name: 'departments.customers', link: '/customer-directory' },
    { name: 'departments.dispatcher', link: '/dispatcher-directory' }
];

export const preProduction = [
    { name: 'production.preProd', link: '' },
    { name: 'production.plants', link: '/plants-directory' },
    { name: 'production.machines', link: '/car-directory' },
    { name: 'production.drivers', link: '/driver-directory' }
];

export const genTech = [
    { name: 'tech.techDept', link: '' },
    { name: 'tech.mixtures', link: '/mixture-directory' },
    { name: 'tech.strength', link: '/rec-strength-directory' },
    { name: 'tech.mobility', link: '/rec-mobility-directory' },
    { name: 'tech.frost', link: '/rec-frost-directory' },
    { name: 'tech.water', link: '/rec-wat-directory' },
    { name: 'tech.marka', link: '/marka-directory' },
    { name: 'tech.conditions', link: '/rec-comment-directory' },
    { name: 'tech.components', link: '/comp-directory' },
];

export enum generalLinks {
    createEditOrder = 'create-edit-order',
    reports = 'reports',
    weighingReports = 'weighing-reports'
}