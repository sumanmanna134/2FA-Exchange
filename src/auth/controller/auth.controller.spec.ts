import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { INestApplication } from '@nestjs/common';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let app: INestApplication;

  const signupCredentialsDto: SignupCredentialsDto = {
    username: 'suman.manna134',
    password: 'Password123!',
  };

  const findOneResponse = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      isTwoFactorEnable: true,
      username: 'suman.manna134',
      user_info: {
        petName: 'kenny',
        modified_photo: 'string',
        address: 'Margitlaan 523, Noord Streundingsland, GA 2671 UZ',
      },
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            getNewAccessAndRefreshToken: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            signup: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            signIn: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),
            signOut: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            getAccessToken: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            getRefreshToken: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            updateRefreshTokenInUser: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),

            getUserIfRefreshTokenMatches: jest.fn(
              () => new Promise((resolve) => resolve(findOneResponse)),
            ),
          }),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('POST /auth/signup Create a User', () => {
    it('Successfully create a new user', async () => {
      expect(await authController.signUp(signupCredentialsDto)).toBeDefined();
    });
  });

  describe('POST /auth/signin get accessToken', () => {
    it('Successfully response to getAccessToken ', async () => {
      jest.spyOn(authService, 'signIn');
      expect(await authController.signIn(signupCredentialsDto)).toBeDefined();
    });
  });
});
