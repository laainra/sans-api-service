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
 *     responses:
 *       200:
 *         description: Register berhasil.
 *         content:
 *           application/json:
 *             schema:
 *               message: 
 *                 type: string
 *                 example: User was registered successfully!
 *       400:
 *         description: Register gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Username is already taken! User registration failed.
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
 *     responses:
 *       200:
 *         description: Register berhasil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Register berhasil
 *       400:
 *         description: Register gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: User Not found.
 */
