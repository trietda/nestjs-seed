import {registerAs} from "@nestjs/config";

export default registerAs('swagger', () => ({
  title: 'App',
  description: 'App API',
}));
