import { supabase } from '../lib/supabase'

// Tier thresholds and discounts
const TIERS = {
    Bronze:   { minPoints: 0,    discount: 0.05 },
    Silver:   { minPoints: 100,  discount: 0.10 },
    Gold:     { minPoints: 500,  discount: 0.15 },
    Platinum: { minPoints: 1000, discount: 0.20 },
}

// Every Rp 10.000 spent = 1 point
const POINTS_PER_RUPIAH = 10000

export function calculateTier(totalPoints) {
    if (totalPoints >= TIERS.Platinum.minPoints) return 'Platinum'
    if (totalPoints >= TIERS.Gold.minPoints) return 'Gold'
    if (totalPoints >= TIERS.Silver.minPoints) return 'Silver'
    return 'Bronze'
}

export function calculateDiscount(tier) {
    return TIERS[tier]?.discount || 0.05
}

export function calculatePoints(spentAmount) {
    return Math.floor(spentAmount / POINTS_PER_RUPIAH)
}

// Called after order is created: add points and check tier upgrade
export async function addPointsAndCheckTier(userId, spentAmount) {
    // Get current profile
    const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('points, tier')
        .eq('id', userId)
        .single()

    if (fetchError) throw fetchError

    const newPoints = (profile.points || 0) + calculatePoints(spentAmount)
    const newTier = calculateTier(newPoints)

    const { error: updateError } = await supabase
        .from('users')
        .update({ points: newPoints, tier: newTier })
        .eq('id', userId)

    if (updateError) throw updateError

    return { newPoints, newTier, previousTier: profile.tier }
}
