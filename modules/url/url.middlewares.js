export const validateUrl = async (req, res, next) => {
    const url = req?.body?.url;
    if (!url) return res.status(400).send({
        success: false,
        message: "url is required in body"
    })
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid url'
            })
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}

export const validateShortId = async (req, res, next) => {
    const short = req?.params?.short;

    if (!short) return res.status(400).send({
        success: false,
        message: "Short Id is required in params"
    })

    next();
}