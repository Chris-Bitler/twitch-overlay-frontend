export const convertEventToUserDisplay = (event: any) => {
    const type = event.type;
    switch (type) {
        case 'SUB':
            return { username: event.subber, text: 'Sub' }
        case 'RAID':
            return { username: event.raider, text: `Raid (${event.viewers} viewers)`}
        case 'GIFT_SUB':
            const text = event.giftAmount && event.cumulativeGiftAmount ? `Gift x${event.giftAmount} (${event.cumulativeGiftAmount})` : 'Gift x1'
            return { username: event.gifter, text}
        case 'FOLLOW':
            return { username: event.follower, text: 'Follow' }
        case 'CHEER':
            return { username: event.cheerer, text: `${event.amount} bits`}
        default:
            return { username: '', text: '' }
    }
}