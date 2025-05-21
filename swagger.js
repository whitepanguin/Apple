// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '당근마켓 클론 API',
      version: '1.0.0',
      description: '당근마켓 클론 프로젝트용 API 문서입니다.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: '로컬 개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: '회원가입, 로그인, 사용자 인증 관련 API',
      },
      {
        name: 'Posts',
        description: '게시글 CRUD 관련 API',
      },
      {
        name: 'Chat',
        description: '채팅 기능 관련 API',
      },
    ],
  },
  apis: ['./router/*.mjs', './controller/*.mjs'], // Swagger 주석 대상
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
