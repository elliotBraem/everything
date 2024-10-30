/* eslint-disable no-console */
import { app, port } from './server';

app.listen(port, () => {
  console.log(`Express proxy server running on http://localhost:${port}`);
});
