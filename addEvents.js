// const Moralis = require("moralis-v1/node")
const Parse = require("parse/node")

require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId

// temp fix for Moralis v2:
// let chainId = process.env.chainId || 5
// let moralisChainId = chainId == "5" ? "1337" : chainId
// let moralisChainId = 5
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
    // await Moralis.start({ serverUrl, appId, masterKey })
    await Parse.start({ serverUrl, appId, masterKey }) // masterKey needed?
    console.log(`Working with contract address ${contractAddress}`)

    let ItemListedOptions = {
        // Mortalis understands a local chain is 1337
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemListed(address, address, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }

    let ItemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemBought(address, address, uint256, uint256)",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }

    let ItemCanceledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemCanceled(address, address, uint256)",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
    }

    // const listedResponse = await Moralis.Cloud.run("watchContractEvent", ItemListedOptions, {
    //     useMasterKey: true,
    // })
    // const boughtResponse = await Moralis.Cloud.run("watchContractEvent", ItemBoughtOptions, {
    //     useMasterKey: true,
    // })

    // const canceledResponse = await Moralis.Cloud.run("watchContractEvent", ItemCanceledOptions, {
    //     useMasterKey: true,
    // })

    // temp fix for Moralis v2:
    const listedResponse = await Parse.Cloud.run("watchContractEvent", ItemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Parse.Cloud.run("watchContractEvent", ItemBoughtOptions, {
        useMasterKey: true,
    })

    const canceledResponse = await Parse.Cloud.run("watchContractEvent", ItemCanceledOptions, {
        useMasterKey: true,
    })
    if (listedResponse.success && canceledResponse.success && boughtResponse.success) {
        console.log("Success! Database Updated with watching event")
    } else {
        console.log("Something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
