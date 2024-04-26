// TODO: move to query ??
export function formatEventsSummary(events) {
    let obj = {
        ts: [],
        h: [],
        mh: [],
    };
    for (let event of events) {
        let cat = typeof event.category === 'string' ? parseInt(event.category) : event.category;
        switch (cat) {
            case 0:
                obj.ts.push(event.year);
                break;
            case 1:
            case 2:
                obj.h.push(event.year);
                break;
            case 3:
            case 4:
            case 5:
                obj.mh.push(event.year);
                break;
            default:
            // console.log('did not find category match in stats function');
        }
    }
    return obj;
}
//# sourceMappingURL=formatEventsSummary.js.map