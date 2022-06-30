const Deed = artifacts.require("Deed")

const increaseTime = async (seconds) => {
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [seconds],
        id: 0,
    }, () => { })
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: 0,
    }, () => { })
}

contract("Deed", (accounts) => {
    let deed
    beforeEach(async () => {
        deed = await Deed.new(accounts[0], accounts[1], 5, { from: accounts[0], value: 100 })
    })

    it("should withdraw", async () => {
        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

        await new Promise((resolve) => setTimeout(resolve, 5000))
        await increaseTime(5)
        await deed.withdraw({ from: accounts[0] })

        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

        assert(finalBalance.sub(initialBalance).toNumber() === 100)
    })

    it("should NOT withdraw if too early", async () => {
        try {
            await deed.withdraw({ from: accounts[0] })
        } catch (e) {
            assert(e.message.includes("too early"))
            return
        }
        assert(false)
    })

    it("should NOT withdraw if not lawyer", async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 5000))
            await increaseTime(5)
            await deed.withdraw({ from: accounts[5] })
        } catch (e) {
            assert(e.message.includes("lawyer only"))
            return
        }
        assert(false)
    })
})