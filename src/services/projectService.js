const Projects = require('../models/projects')

const createUserService = async (data) => {
    try {
        const {
            email,
            password,
            FullName,
            Age,
            Role,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber
        } = data;
        console.log(data);

        // Kiểm tra email đã tồn tại hay chưa
        const userExists = await Projects.findOne({ where: { UserName: email } });
        if (userExists) {
            return { status: 'Err', message: 'Email is already registered' };
        }
        console.log(userExists);

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await Accounts.create({
            UserName: email,
            Password: hashedPassword,
        });
        console.log(newAccount)
        const roleInt = parseInt(Role, 10);
        // Tạo user mới với tất cả các trường
        const newUser = await Users.create({
            FullName: FullName,
            Email: email,
            Age: Age,
            Role: roleInt,
            Account: newAccount.Id,
            Bank: Bank,
            BankAccount: BankAccount,
            Address: Address,
            Indentify: Indentify,
            Salary: Salary,
            Sex: Sex,
            PhoneNumber: PhoneNumber,
            Created: new Date(),
            Status: true // Đang hoạt động
        });

        if (newUser) {
            return {
                status: "Success",
                message: "Tạo thành công",
                data: newUser
            };
        }
    } catch (e) {
        console.log(e)
        return { status: "Err", message: e.message };
    }
};