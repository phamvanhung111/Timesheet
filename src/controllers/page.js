const page = async (req, res) => {
    return res.status(200).json("hello");
}

module.exports = {
    page,

}