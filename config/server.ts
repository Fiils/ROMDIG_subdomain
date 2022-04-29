export const dev: boolean = process.env.NODE_ENV !== 'production';

export const server: string = dev ? 'http://localhost:9999' : 'https://www.romdigcoserver.com'
export const client: string = dev ? 'http://localhost:3000' : 'https://www.romdig.net'