import { Container } from 'typedi';
import { useExpressServer } from 'routing-controllers';
import { GameController } from './routes';
import { GameService } from '../services/game.service';
import { QuestionService } from '../services/question.service';
import express from 'express';
import { createServer } from 'http';

export default (app: express.Express, server: ReturnType<typeof createServer>) => {
  // Initialize services
  const questionService = new QuestionService();
  const gameService = new GameService(questionService);
  
  // Register services
  Container.set(GameService, gameService);
  Container.set(QuestionService, questionService);
  
  // Get controller instance
  const controller = new GameController(gameService, questionService);
  Container.set(GameController, controller);
  
  // Initialize WebSocket
  controller.initializeWebSocket(server);
  
  // Register routes
  useExpressServer(app, {
    controllers: [GameController],
    routePrefix: '/api/game',
    validation: true,
    defaultErrorHandler: false
  });
};