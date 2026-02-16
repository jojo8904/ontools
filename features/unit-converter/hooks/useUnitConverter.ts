'use client'

import { useState } from 'react'
import {
  UnitCategory,
  UNIT_CATEGORIES,
  ConversionResult,
  convertUnit,
} from '../utils'

export function useUnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [value, setValue] = useState<number>(1)
  const [fromUnit, setFromUnit] = useState<string>('cm')
  const [toUnit, setToUnit] = useState<string>('m')
  const [result, setResult] = useState<ConversionResult | null>(null)

  const changeCategory = (newCategory: UnitCategory) => {
    setCategory(newCategory)
    const units = UNIT_CATEGORIES[newCategory].units
    setFromUnit(units[0].code)
    setToUnit(units[1].code)
    setResult(null)
  }

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setResult(null)
  }

  const calculate = () => {
    setResult(convertUnit(value, category, fromUnit, toUnit))
  }

  const reset = () => {
    const units = UNIT_CATEGORIES[category].units
    setValue(1)
    setFromUnit(units[0].code)
    setToUnit(units[1].code)
    setResult(null)
  }

  return {
    category,
    value,
    fromUnit,
    toUnit,
    result,
    changeCategory,
    setValue,
    setFromUnit,
    setToUnit,
    swap,
    calculate,
    reset,
  }
}
