import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthRepository } from '../domain/repository/AuthRepository';
import { AuthRepositoryImpl } from '../data/repository/AuthRepositoryImpl';

const container = new Container();

// Repository bindings: abstract interface → concrete implementation
container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepositoryImpl).inSingletonScope();

export { container };
