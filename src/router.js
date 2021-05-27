import DayView from '@/screens/Game/DayView';
import DaySpeechView from '@/screens/Game/DaySpeechView';
import GuardActSelector from '@/screens/Game/GuardActSelector';
import WolfKillSelector from '@/screens/Game/WolfKillSelector';
import HostScreen from '@/screens/Room/HostScreen';
import JoinScreen from '@/screens/Room/JoinScreen';
import FullSetup from '@/screens/Setup/FullSetup';
import VueRouter from 'vue-router';
import { MainRoutes, SetupRoutes, GameRoutes } from '@/configs/routeNames';
import SetupScreen from '@/screens/Setup/SetupScreen';
import TeamSetup from '@/screens/Setup/TeamSetup';
import GoodSetup from '@/screens/Setup/GoodSetup';
import BadSetup from '@/screens/Setup/BadSetup';
import LandingScreen from '@/screens/LandingScreen';
import GameScreen from '@/screens/Game/GameScreen';
import StartGame from './screens/Game/StartGame';
import EndGameView from './screens/Game/EndGameView';
import WolfSelector from './screens/Game/WolfSelector';
import GodSelector from './screens/Game/GodSelector';
import WitchActSelector from './screens/Game/WitchActSelector';
import ProphetActSelector from './screens/Game/ProphetActSelector';
import HunterActSelector from './screens/Game/HunterActSelector';
import ElderActSelector from './screens/Game/ElderActSelector';
import TrainerActSelector from './screens/Game/TrainerActSelector';
import WolfKingActSelector from './screens/Game/WolfKingActSelector';
import VueRouterBackButton from 'vue-router-back-button'
import Vue from 'vue';

const routes = [
  { path: MainRoutes.landing, component: LandingScreen },
  {
    path: MainRoutes.setup,
    component: SetupScreen,
    children: [
      { path: '', component: TeamSetup },
      { path: SetupRoutes.full, component: FullSetup },
      { path: SetupRoutes.good, component: GoodSetup },
      { path: SetupRoutes.bad, component: BadSetup },
    ],
  },
  {
    path: `${MainRoutes.host}/:id?`,
    component: HostScreen,
    props: true,
  },
  {
    path: `${MainRoutes.join}/:id?`,
    component: JoinScreen,
    props: true,
  },
  {
    path: `${MainRoutes.game}`,
    component: GameScreen,
    children: [
      {
        path: '/',
        redirect: GameRoutes.start,
      },
      {
        path: GameRoutes.start,
        component: StartGame,
      },
      {
        path: GameRoutes.endGame,
        component: EndGameView,
      },
      {
        path: GameRoutes.wolf,
        component: WolfSelector,
      },
      {
        path: GameRoutes.wolfKill,
        component: WolfKillSelector,
      },
      {
        path: `${GameRoutes.god}/:name`,
        component: GodSelector,
        props: true,
      },
      {
        path: `${GameRoutes.day}`,
        component: DayView,
      },
      {
        path: GameRoutes.daySpeech,
        component: DaySpeechView,
      },
      {
        path: `${GameRoutes.witchAct}/:skill`,
        component: WitchActSelector,
        props: true,
      },
      {
        path: GameRoutes.prophetAct,
        component: ProphetActSelector,
      },
      {
        path: GameRoutes.hunterAct,
        component: HunterActSelector,
      },
      {
        path: GameRoutes.elderAct,
        component: ElderActSelector,
      },
      {
        path: GameRoutes.wolfKingAct,
        component: WolfKingActSelector,
      },
      {
        path: GameRoutes.trainerAct,
        component: TrainerActSelector,
      },
      {
        path: GameRoutes.guardAct,
        component: GuardActSelector,
      }
    ],
  },
];

const router = new VueRouter({ routes });
Vue.use(VueRouterBackButton, { router });

export default router;
