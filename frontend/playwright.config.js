const config = {
    webServer: {
        command: 'pnpm run dev',
        port: 9001,
        timeout: 120 * 1000,
        reuseExistingServer: true,
    }
}
export default config
// module.exports = config