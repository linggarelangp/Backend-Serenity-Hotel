import app from "./app"

const host: string = process.env.HOST_URL as string | 'localhost'
const port: number | 3000 = Number(process.env.PORT_URL) | 3000

app.listen(port, (): void => {
    console.log(`App running at http://${host}:${port}`)
})