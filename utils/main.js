module.exports = async (options) => {
    options = {
        ...options,
        directory: process.cwd()
    }
    console.log(options)
}