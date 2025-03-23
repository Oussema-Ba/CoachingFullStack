import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 131,
        label: 'MENUITEMS.PROVIDER.TEXT',
        icon: ' ri-team-line',
        subItems: [
            {
                id: 85,
                label: 'MENUITEMS.PROVIDER.LIST.LIST',
                link: '/providers',
                parentId: 84
            },
            {
                id: 86,
                label: 'MENUITEMS.PROVIDER.LIST.CREATE',
                link: '/providers/add',
                parentId: 84,
            }
        ]
    },
];
