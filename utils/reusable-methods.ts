export class ReusableMethods {
    async getCurrentFormattedDate(): Promise<{ month: string; day: string; year: number }> {
        const currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        
        const month = monthNames[currentDate.getMonth()];
        console.log('month consoled from utils: ', month)
        const day = String(currentDate.getDate());
        console.log('day consoled from utils: ', day)
        const year = currentDate.getFullYear();
        console.log('year consoled from utils: ', year)
        return { month, day, year };
    }
}