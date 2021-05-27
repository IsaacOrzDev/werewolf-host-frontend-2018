import { GameRoutes } from '@/configs/routeNames';
import { dayActionType } from './actionType';

export const characterNames = {
  civilian: '平民',
  hunter: '獵人',
  knight: '騎士',
  prophet: '預言家',
  witch: '女巫',
  elder: '禁言長老',
  trainer: '馴熊師',
  guard: '守衛',
  wolf: '狼人',
  wolfKing: '狼王',
};

const characters = [
  {
    name: '平民',
    team: 'good',
    image: 'pm.jpg',
    label: 'pm-1.png',
    allowDuplicate: true,
    init: {},
    nightActions: [],
  },
  {
    name: '獵人',
    team: 'good',
    image: 'lr.jpg',
    label: 'lr-1.png',
    nightOrder: 150,
    init: {
      route: `${GameRoutes.god}/${characterNames.hunter}`,
      speech: '獵人張開眼',
      hint: '[主持請選擇獵人]',
    },
    actionsRoutes: [],
    nightActions: [],
    dieActions: [
      {
        order: 100,
        route: GameRoutes.hunterAct,
        action: dayActionType.hunterShot,
      },
    ],
  },
  {
    name: '騎士',
    team: 'good',
    image: 'qs.jpg',
    label: 'qs-1.png',
    items: ['knight'],
    nightOrder: 160,
    init: {
      route: `${GameRoutes.god}/${characterNames.knight}`,
      speech: '騎士張開眼',
      hint: '[主持請選擇騎士]',
    },
    nightActions: [],
  },
  {
    name: '預言家',
    team: 'good',
    image: 'yyj.jpg',
    label: 'yyj-1.png',
    nightOrder: 130,
    init: {
      route: `${GameRoutes.god}/${characterNames.prophet}`,
      speech: '預言家張開眼',
      hint: '[主持請選擇預言家]',
    },
    nightActions: [
      {
        route: 'ProphetAct',
      },
    ],
  },
  {
    name: '女巫',
    team: 'good',
    image: 'nw.jpg',
    label: 'nw-1.png',
    items: ['cure', 'poison'],
    nightOrder: 120,
    init: {
      route: `${GameRoutes.god}/${characterNames.witch}`,
      speech: '女巫張開眼',
      hint: '[主持請選擇女巫]',
    },
    actionsRoutes: [],
    nightActions: [
      {
        route: `${GameRoutes.witchAct}/cure`,
        requiredItem: 'cure',
      },
      {
        route: `${GameRoutes.witchAct}/poison`,
        requiredItem: 'poison',
      },
    ],
  },
  {
    name: '禁言長老',
    team: 'good',
    image: 'jy.jpg',
    nightOrder: 140,
    init: {
      route: `${GameRoutes.god}/${characterNames.elder}`,
      speech: '禁言長老張開眼',
      hint: '[主持請選擇禁言長老]',
    },
    nightActions: [
      {
        route: GameRoutes.elderAct,
      },
    ],
  },
  {
    name: '馴熊師',
    team: 'good',
    image: 'trainer.jpg',
    nightOrder: 200,
    init: {
      route: `${GameRoutes.god}/${characterNames.trainer}`,
      speech: '馴熊師張開眼',
      hint: '[主持請選擇馴熊師]',
    },
    nightActions: [
      {
        route: `${GameRoutes.trainerAct}`,
      },
    ],
  },
  {
    name: '守衛',
    team: 'good',
    image: 'guard.jpg',
    nightOrder: 150,
    init: {
      route: `${GameRoutes.god}/${characterNames.guard}`,
      speech: '守衛張開眼',
      hint: '[主持請選擇守衛]',
    },
    nightActions: [
      {
        route: GameRoutes.guardAct,
      },
    ],
  },
  {
    name: '狼人',
    team: 'bad',
    image: 'langr.jpg',
    label: 'langr-1.png',
    allowDuplicate: true,
    nightOrder: 100,
    init: {
      route: GameRoutes.wolf,
      speech: '狼人張開眼，互認對方',
      hint: '[主持請選擇狼人，不包括狼王]',
    },
    nightActions: [
      {
        route: GameRoutes.wolfKill,
      },
    ],
  },
  {
    name: '狼王',
    team: 'bad',
    image: 'lw.jpg',
    label: 'lw-1.png',
    nightOrder: 110,
    init: {
      route: `${GameRoutes.god}/${characterNames.wolfKing}`,
      speech: '狼王請舉起手指公',
      hint: '[主持請選擇狼王]',
    },
    nightActions: [],
    dieActions: [
      {
        route: GameRoutes.wolfKingAct,
        action: dayActionType.wolfKingShot,
      },
    ],
  },
];

export default characters;
