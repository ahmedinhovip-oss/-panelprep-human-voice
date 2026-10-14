// Vercel 2026 zero-config Express entry point.
// Keeping this file at the project root lets Vercel detect the Express app
// correctly and route all application requests through one Node function.
import express from 'express';
import app from './server/index.js';

// The direct import is intentional: Vercel's Express detector looks for the
// framework in a recognized root entry file such as server.js.
void express;

export default app;
