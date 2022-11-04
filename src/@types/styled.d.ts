import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme;

//criando tipagem para modo styled-components
// se não tivesse importando styled-components o ts entenderia que estamos criando a tipagem do zero.
declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}