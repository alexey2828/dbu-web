export const isUniqueCode = (data: any, setError: any, code: any) => {
    const existingCode = data?.some((item: any) => item.code === code);
    if (existingCode) {
        setError('code', {
            type: 'manual',
            message: 'Код уже существует',
        });
        return true
    }
    return false
}