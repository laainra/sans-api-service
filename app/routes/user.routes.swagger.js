/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: >-
 *       Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".
 * tags:
 *   name: User
 * /user:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: tampil profile
 *     tags: [User]
 *   post:
 *     security:
 *      - Bearer: [] 
 *     summary: update profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 */
