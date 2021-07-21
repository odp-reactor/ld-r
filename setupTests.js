require('dotenv').config();
import 'regenerator-runtime/runtime'

// in CI some tasks goes in timeout
jest.setTimeout(20000);
