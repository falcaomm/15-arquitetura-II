import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError} from "../errors/BadRequestError"
import { ID_EXIST, ID_INVALID } from "../errors/messageErros"
import { User } from "../models/User"
import { UserDB } from "../types"

export class UserBusiness {
    public getUsers = async (q: string | undefined) => {
        const userDatabase = new UserDatabase()
        const usersDB = await userDatabase.findUsers(q)

        const users: User[] = usersDB.map((userDB) => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.created_at
        ))

        return users
    }

    public createUser = async (input: any) => {
        const { id, name, email, password } = input

        if (typeof id !== "string") {
            throw new BadRequestError(ID_INVALID)
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDatabase = new UserDatabase()
        const userDBExists = await userDatabase.findUserById(id)

        if (userDBExists) {
            throw new BadRequestError(ID_EXIST)
        }

        const newUser = new User(
            id,
            name,
            email,
            password,
            new Date().toISOString()
        ) // yyyy-mm-ddThh:mm:sssZ

        const newUserDB: UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            created_at: newUser.getCreatedAt()
        }

        await userDatabase.insertUser(newUserDB)

        const output = {
            message: "Cadastro realizado com sucesso",
            user: newUser
        }

        return output
    }
}