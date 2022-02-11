export const convertEventToUserDisplay = (event) => {
    const type = event.type;
    switch (type) {
        case 'SUB':
            return { username: event.subber, text: 'Sub' }
        case 'RAID':
            return { username: event.raider, text: `Raid (${event.viewers} viewers)`}
        case 'GIFT_SUB':
            let text = 'Gift x1';
            if (event.giftAmount) {
                text = `Gift x${event.giftAmount}`;
            }
            if (event.cumulativeGiftAmount) {
                text += ` (${event.cumulativeGiftAmount})`;
            }
            return { username: event.gifter, text}
        case 'FOLLOW':
            return { username: event.follower, text: 'Follow' }
        case 'CHEER':
            return { username: event.cheerer, text: `${event.amount} bits`}
        default:
            return { username: '', text: '' }
    }
}