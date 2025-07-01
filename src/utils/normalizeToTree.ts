import { TreeNode } from "../types/algorithm"

export const normalizeToTree = (
  obj: any,
  name: string = "root",
  x: number,
  y: number,
  spacingX: number,
  spacingY: number
): TreeNode => {
  const node: TreeNode = {
    name,
    value: null,
    children: [],
    x,
    y,
  }

  const childY = y + spacingY

  if (obj !== null && typeof obj === "object") {
    if (Array.isArray(obj)) {
      node.value = obj
    } else {
      const keys = Object.keys(obj)
      const count = keys.length

      keys.forEach((childKey, index) => {
        const offset = (index - (count - 1) / 2) * spacingX * 0.75
        const childX = x + offset

        const childNode = normalizeToTree(
          obj[childKey],
          childKey,
          childX,
          childY,
          spacingX,
          spacingY
        )
        node.children.push(childNode)
      })
    }
  } else {
    node.value = obj
  }

  return node
}
