const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');
const Variable = require('../../engine/variable');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzOC45NjE5OCIgaGVpZ2h0PSIzOS4xMTg5NyIgdmlld0JveD0iMCwwLDM4Ljk2MTk4LDM5LjExODk3Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIwLjUxOTAxLC0xNjAuNDQwNTEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGc+PHBhdGggZD0iTTIyMS4yNjkwMSwxOTguODA5NDl2LTM3LjYxODk3aDM3LjQ2MTk4djM3LjYxODk3eiIgZmlsbD0iI2ZmZjNkOCIgc3Ryb2tlPSIjZDM4ZjAwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQ0Ljg5MjgzLDE5MC4zODcxOGwxLjUxMTY0LDEuNjYyNjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyNC40MDkxMSwxNzAuMjQxMDkpIHNjYWxlKDAuMTg3MSwwLjE4NzEpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0iJnF1b3Q744OS44Op44Ku44OO6KeS44K0IFBybyBXMyZxdW90OywgJnF1b3Q7SGlyYWdpbm8gS2FrdSBHb3RoaWMgUHJvJnF1b3Q7LCBPc2FrYSwgJnF1b3Q744Oh44Kk44Oq44KqJnF1b3Q7LCBNZWlyeW8sICZxdW90O++8re+8syDvvLDjgrTjgrfjg4Pjgq8mcXVvdDssICZxdW90O01TIFBHb3RoaWMmcXVvdDsiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+VURMPC90c3Bhbj48L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjM5LjYxNDQsMTcwLjA4NzA3KSBzY2FsZSgwLjE4NzA5LDAuMTg3MDkpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjZDM4ZjAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2QzOGYwMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0iJnF1b3Q744OS44Op44Ku44OO6KeS44K0IFBybyBXMyZxdW90OywgJnF1b3Q7SGlyYWdpbm8gS2FrdSBHb3RoaWMgUHJvJnF1b3Q7LCBPc2FrYSwgJnF1b3Q744Oh44Kk44Oq44KqJnF1b3Q7LCBNZWlyeW8sICZxdW90O++8re+8syDvvLDjgrTjgrfjg4Pjgq8mcXVvdDssICZxdW90O01TIFBHb3RoaWMmcXVvdDsiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+VGVsbG88L3RzcGFuPjwvdGV4dD48cGF0aCBkPSJNMjQxLjU2MTYsMTc4LjQ4NjEzYy0wLjg2NTcsMS44MjExNSAtMi45NTg1NSwyLjcxOTQ1IC00LjY3NDUsMi4wMDY0MWMtMS43MTU5NSwtMC43MTMwNCAtMi40MDUyMSwtMi43Njc0MSAtMS41Mzk1LC00LjU4ODU2YzAuODY1NywtMS44MjExNSAyLjk1ODU0LC0yLjcxOTQ1IDQuNjc0NDksLTIuMDA2NDFjMS43MTU5NSwwLjcxMzA0IDIuNDA1MjEsMi43Njc0MSAxLjUzOTUxLDQuNTg4NTZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTAuNzcyOTgsMTgxLjE0NTQ5Yy0wLjUyMTg2LDEuOTY0MTggLTIuMzY0NDEsMy4xODgxOCAtNC4xMTU0NSwyLjczMzg4Yy0xLjc1MTA1LC0wLjQ1NDMgLTIuNzQ3NSwtMi40MTQ4NSAtMi4yMjU2NCwtNC4zNzkwM2MwLjUyMTg2LC0xLjk2NDE4IDIuMzY0NDEsLTMuMTg4MTcgNC4xMTU0NSwtMi43MzM4OGMxLjc1MTA1LDAuNDU0MyAyLjc0NzUsMi40MTQ4NSAyLjIyNTY0LDQuMzc5MDN6IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzkuMzc3NzEsMTgyLjUyNDExbDIuOTA4MzUsLTEuNDQ2NzVsMS4yNDEyOCwzLjQ1NDIzbC0yLjkwODM2LDEuNDQ2NzV6IiBmaWxsPSIjNzA3MDcwIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzguMzc1MjYsMTg5LjI3MzcyYy0xLjA2MTMsMi41NDM1MiAtMy44NTEyOSwzLjg5ODI4IC02LjIzMTYzLDMuMDI1OTNjLTIuMzgwMzQsLTAuODcyMzQgLTMuNDQ5NjQsLTMuNjQxNDUgLTIuMzg4MzQsLTYuMTg0OTdjMS4wNjEzLC0yLjU0MzUyIDMuODUxMjksLTMuODk4MjggNi4yMzE2MywtMy4wMjU5NGMyLjM4MDM0LDAuODcyMzQgMy40NDk2NCwzLjY0MTQ1IDIuMzg4MzQsNi4xODQ5OHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0OC41OTg0MywxOTEuODY2MTRjLTAuOTM1NDMsMi4yNDE4OCAtMy4zOTQ1NSwzLjQzNTk3IC01LjQ5MjYsMi42NjcwOGMtMi4wOTgwNSwtMC43Njg4OSAtMy4wNDA1MywtMy4yMDk2IC0yLjEwNTEsLTUuNDUxNDhjMC45MzU0MywtMi4yNDE4OCAzLjM5NDU1LC0zLjQzNTk4IDUuNDkyNiwtMi42NjcwOWMyLjA5ODA1LDAuNzY4ODkgMy4wNDA1MywzLjIwOTYxIDIuMTA1MSw1LjQ1MTQ5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM3LjI2MzYzLDE3NS44MDcxM2wxLjI0MjA5LDEuNTAzNThsLTAuODQ5ODUsMS42OTk3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM4LjUwNTcyLDE3Ny4yNDUzNGwxLjc2NTA3LC0wLjE5NjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ3LjE1MzExLDE3OC40NzY2NmwwLjM3MzY0LDEuOTE0MTNsLTEuNTU4MTYsMS4wODc4MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0Ny41NTc5NSwxODAuMzMzMzZsMS42NDQ1OSwwLjY3MDI5IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM1Ljg5NzY2LDE4NS4zNTEyMmwtMS43MTQ2NywyLjQxNzgxbC0yLjgzMDU0LC0wLjU3NDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM1LjI2NTM5LDE5MC4yNTU2bC0wLjk4NjQ4LC0yLjUxMjQ0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ1LjUyODczLDE4OC4xNjlsLTAuNjE4MDYsMi4zODkwNGwtMi4zNzI0MiwwLjM5MTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzOC45NjE5OCIgaGVpZ2h0PSIzOS4xMTg5NyIgdmlld0JveD0iMCwwLDM4Ljk2MTk4LDM5LjExODk3Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIwLjUxOTAxLC0xNjAuNDQwNTEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGc+PHBhdGggZD0iTTIyMS4yNjkwMSwxOTguODA5NDl2LTM3LjYxODk3aDM3LjQ2MTk4djM3LjYxODk3eiIgZmlsbD0iI2ZmZjNkOCIgc3Ryb2tlPSIjZDM4ZjAwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQ0Ljg5MjgzLDE5MC4zODcxOGwxLjUxMTY0LDEuNjYyNjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyNC40MDkxMSwxNzAuMjQxMDkpIHNjYWxlKDAuMTg3MSwwLjE4NzEpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0iJnF1b3Q744OS44Op44Ku44OO6KeS44K0IFBybyBXMyZxdW90OywgJnF1b3Q7SGlyYWdpbm8gS2FrdSBHb3RoaWMgUHJvJnF1b3Q7LCBPc2FrYSwgJnF1b3Q744Oh44Kk44Oq44KqJnF1b3Q7LCBNZWlyeW8sICZxdW90O++8re+8syDvvLDjgrTjgrfjg4Pjgq8mcXVvdDssICZxdW90O01TIFBHb3RoaWMmcXVvdDsiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+VURMPC90c3Bhbj48L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjM5LjYxNDQsMTcwLjA4NzA3KSBzY2FsZSgwLjE4NzA5LDAuMTg3MDkpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjZDM4ZjAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2QzOGYwMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0iJnF1b3Q744OS44Op44Ku44OO6KeS44K0IFBybyBXMyZxdW90OywgJnF1b3Q7SGlyYWdpbm8gS2FrdSBHb3RoaWMgUHJvJnF1b3Q7LCBPc2FrYSwgJnF1b3Q744Oh44Kk44Oq44KqJnF1b3Q7LCBNZWlyeW8sICZxdW90O++8re+8syDvvLDjgrTjgrfjg4Pjgq8mcXVvdDssICZxdW90O01TIFBHb3RoaWMmcXVvdDsiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+VGVsbG88L3RzcGFuPjwvdGV4dD48cGF0aCBkPSJNMjQxLjU2MTYsMTc4LjQ4NjEzYy0wLjg2NTcsMS44MjExNSAtMi45NTg1NSwyLjcxOTQ1IC00LjY3NDUsMi4wMDY0MWMtMS43MTU5NSwtMC43MTMwNCAtMi40MDUyMSwtMi43Njc0MSAtMS41Mzk1LC00LjU4ODU2YzAuODY1NywtMS44MjExNSAyLjk1ODU0LC0yLjcxOTQ1IDQuNjc0NDksLTIuMDA2NDFjMS43MTU5NSwwLjcxMzA0IDIuNDA1MjEsMi43Njc0MSAxLjUzOTUxLDQuNTg4NTZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTAuNzcyOTgsMTgxLjE0NTQ5Yy0wLjUyMTg2LDEuOTY0MTggLTIuMzY0NDEsMy4xODgxOCAtNC4xMTU0NSwyLjczMzg4Yy0xLjc1MTA1LC0wLjQ1NDMgLTIuNzQ3NSwtMi40MTQ4NSAtMi4yMjU2NCwtNC4zNzkwM2MwLjUyMTg2LC0xLjk2NDE4IDIuMzY0NDEsLTMuMTg4MTcgNC4xMTU0NSwtMi43MzM4OGMxLjc1MTA1LDAuNDU0MyAyLjc0NzUsMi40MTQ4NSAyLjIyNTY0LDQuMzc5MDN6IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzkuMzc3NzEsMTgyLjUyNDExbDIuOTA4MzUsLTEuNDQ2NzVsMS4yNDEyOCwzLjQ1NDIzbC0yLjkwODM2LDEuNDQ2NzV6IiBmaWxsPSIjNzA3MDcwIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzguMzc1MjYsMTg5LjI3MzcyYy0xLjA2MTMsMi41NDM1MiAtMy44NTEyOSwzLjg5ODI4IC02LjIzMTYzLDMuMDI1OTNjLTIuMzgwMzQsLTAuODcyMzQgLTMuNDQ5NjQsLTMuNjQxNDUgLTIuMzg4MzQsLTYuMTg0OTdjMS4wNjEzLC0yLjU0MzUyIDMuODUxMjksLTMuODk4MjggNi4yMzE2MywtMy4wMjU5NGMyLjM4MDM0LDAuODcyMzQgMy40NDk2NCwzLjY0MTQ1IDIuMzg4MzQsNi4xODQ5OHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0OC41OTg0MywxOTEuODY2MTRjLTAuOTM1NDMsMi4yNDE4OCAtMy4zOTQ1NSwzLjQzNTk3IC01LjQ5MjYsMi42NjcwOGMtMi4wOTgwNSwtMC43Njg4OSAtMy4wNDA1MywtMy4yMDk2IC0yLjEwNTEsLTUuNDUxNDhjMC45MzU0MywtMi4yNDE4OCAzLjM5NDU1LC0zLjQzNTk4IDUuNDkyNiwtMi42NjcwOWMyLjA5ODA1LDAuNzY4ODkgMy4wNDA1MywzLjIwOTYxIDIuMTA1MSw1LjQ1MTQ5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM3LjI2MzYzLDE3NS44MDcxM2wxLjI0MjA5LDEuNTAzNThsLTAuODQ5ODUsMS42OTk3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM4LjUwNTcyLDE3Ny4yNDUzNGwxLjc2NTA3LC0wLjE5NjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ3LjE1MzExLDE3OC40NzY2NmwwLjM3MzY0LDEuOTE0MTNsLTEuNTU4MTYsMS4wODc4MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzA3MDcwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0Ny41NTc5NSwxODAuMzMzMzZsMS42NDQ1OSwwLjY3MDI5IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM1Ljg5NzY2LDE4NS4zNTEyMmwtMS43MTQ2NywyLjQxNzgxbC0yLjgzMDU0LC0wLjU3NDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjM1LjI2NTM5LDE5MC4yNTU2bC0wLjk4NjQ4LC0yLjUxMjQ0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MDcwNzAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ1LjUyODczLDE4OC4xNjlsLTAuNjE4MDYsMi4zODkwNGwtMi4zNzI0MiwwLjM5MTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwNzA3MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

const _ARMARKER_HAT_BLOCK_ = 'udltello_armarkerdetected';
const _ARMARKER_LIST_FIELD_NAME_ = 'arMarkerNames';

const telloNotConnectMessage = 'Telloに接続できません。\n';

/**
 * 計算単位
 *   1: 時間
 *   2: 距離
 */
const calc_unit = 1;

/**
 * コマンドの名称一覧
 */
const upDesc = ['秒 上昇する', 'cm 上昇する'];
const downDesc = ['秒 下降する', 'cm 下降する'];
const leftDesc = ['秒 左に移動する', 'cm 左に移動する'];
const rightDesc = ['秒 右に移動する', 'cm 右に移動する'];
const forwardDesc = ['秒 前進する', 'cm 前進する'];
const backwardDesc = ['秒 後退する', 'cm 後退する'];
const leftturnDesc = ['秒 左旋回する', '度 左旋回する'];
const rightturnDesc = ['秒 右旋回する', '度 右旋回する'];

const armarkernames = [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                       ['ウマ', 'ヒツジ', 'トナカイ', 'ニワトリ', 'ゴリラ', 'サイ', 'クマ', 'パンダ', 'ライオン', 'サル']];
const armarkernumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const isloop = false;
const armarkerdetectnum = [];

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3UdlCameraAR {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.ardetectintervalid;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'udlcamera',
            name: 'UDL Camera',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'armarkerdetectstart',
                    text: 'ARマーカー処理開始',
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'armarkerdetectend',
                    text: 'ARマーカー処理終了',
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'armarkerdetected',
                    text: 'ARマーカーの[n]が見えたとき',
                    blockType: BlockType.HAT,
                    arguments: {
                        n: {
                            type: ArgumentType.STRING,
                            menu: _ARMARKER_LIST_FIELD_NAME_,
                            defaultValue: 1
                        }
                    }
                },
            ],
            menus: {
                arMarkerNames: {
                    acceptReporters: true,
                    items: this._formatMenu(armarkernames[1]),
                    values: armarkernames[0]
                }
            }
        };
    }

    /**
     * ARマーカーのxxが検出されたとき
     */
    armarkerdetected(args) {
        const n = Cast.toNumber(args.n);
        if (armarkerdetectnum.length > 0) {
            var arraynum = armarkerdetectnum.length;
            for (var i = 0; i < arraynum; i++) {
                const arnum = Cast.toNumber(armarkerdetectnum.shift());
                if (n == arnum) {
                    console.log("n: " + n.toString() + ", arnum: " + arnum.toString() + ", armarkerdetectnum.length: " + armarkerdetectnum.length);
                    return true;
                }
                else{
                    // 他のブロックで使用されているARマーカー番号だった場合は、リストに戻す
                    if (this.isARMarkerBlockNumExists(arnum)) {
                        armarkerdetectnum.push(arnum);
                    }
                }
            }
        }
        return false;
    }
   
    armarkerdetectstart() {
        this.ardetectintervalid = setInterval(() => {
            console.log("called armarkerdetectstart()");
            CefSharp.BindObjectAsync("boundAsync");
            boundAsync.armarkerdetected((ret)=>{
                console.log("called armarkerdetectstart() return: " + ret);
                armarkerdetectnum.push(ret);
            });
        }, 500);
    }

    armarkerdetectend() {
        console.log("called armarkerdetectend(): " + this.ardetectintervalid.toString());
        clearInterval(this.ardetectintervalid);
    }

    /**
     * HATテスト
     */
    hattest(args, util) {

        if (this.isARMarkerBlockNumExists(args.m)) {

        }

        this._updateTempo(30);

        const nowSprite = this.runtime.getEditingTarget();

        const blocks = nowSprite.blocks;

        for (const id in blocks._blocks) {
            block = blocks._blocks[id];
            if (block.opcode == 'udltello_hattest') {
                for (const ipt in block.inputs) {
                    //console.log(ipt);
                }
                for (const fld in block.fields) {
                    console.log(fld);
                }
                console.log('find!!!');
            }
        }
    }


    /** =======================================================================================================================================
     * 
     */
    /**
     * 指定されたopcodeを持つBlockが存在するか
     */
    isBlockExists(opcode) {
        const blocks = this.runtime.getEditingTarget().blocks;

        for (const id in blocks._blocks) {
            if (blocks.getBlock(id).opcode == opcode) {
                return true;
            }
        }

        return false;
    }

    /**
     * 指定された引数を持つARマーカー HAT Blockが存在するか確認
     *   TODO:どのようにしてブロックの持つ引数の内容を取得するか調査して実装する
     *         armarkerdetected(args) を修正する
     */
    isARMarkerBlockNumExists(num) {
        const blocks = this.runtime.getEditingTarget().blocks;

        for (const id in blocks._blocks) {
            block = blocks._blocks[id];

            for (const fld in block.fields) {
                const fieldname = block.fields[fld].name;
                const fieldvalue = block.fields[fld].value;
                if (fieldname == _ARMARKER_LIST_FIELD_NAME_) {
                    if (fieldvalue == num) {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    _formatMenu (menu) {
        const m = [];
        for (let i = 0; i < menu.length; i++) {
            const obj = {};
            obj.text = menu[i];
            obj.value = (i+1).toString();
            m.push(obj);
        }
        return m;
    }

}

module.exports = Scratch3UdlCameraAR;