export default function sliceAddress(address, n = 4) {
    return address.slice(0, n) + '...' + address.slice(-n)
}
