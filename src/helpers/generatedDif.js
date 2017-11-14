export default function generatedDif(cur, target, ds, velocity = 1) {
    return ['x', 'y', 'z'].reduce(
        (v, axis) => {
            v[axis] = (target[axis] - cur[axis])*velocity*ds;
            return v;
        }, {}
    )
}