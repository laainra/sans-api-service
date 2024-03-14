/**
 * @swagger
 * tags:
 *   name: Auth
 * /auth/signup:
 *   post:
 *     summary: register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 * /auth/signin:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: qaz
 *               password:
 *                 type: string
 *                 example: qaz
 *             required:
 *               - username
 *               - password   
 */
