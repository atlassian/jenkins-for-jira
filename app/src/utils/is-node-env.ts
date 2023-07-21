import { EnvironmentEnum } from '../common/types';

export const getNodeEnv = () => process.env.NODE_ENV || EnvironmentEnum.DEV;
export const isNodeEnv = (env: EnvironmentEnum) => getNodeEnv() === env;
export const isNodeProd = () => isNodeEnv(EnvironmentEnum.PROD);
export const isNodeDev = () => isNodeEnv(EnvironmentEnum.DEV);
export const isNodeTest = () => isNodeEnv(EnvironmentEnum.TEST);
