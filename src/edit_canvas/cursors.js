import { getCurrentProjectEditor } from '../app/main.js';
import { eventHandlerData } from './events.js';
import { canResize } from './events_mouse.js';

export function updateCursor(tool) {
	// log('updateCursor', 'start');
	const editor = getCurrentProjectEditor();
	tool = tool || editor.selectedTool;

	// log('tool = ' + tool);

	if (eventHandlerData.isMouseOverCanvas) {
		if (tool === 'newRectangle') {
			// log('setting cursor to crosshairSquare');
			setCursor('crosshairSquare');
		} else if (tool === 'newOval') {
			// log('setting cursor to crosshairCircle');
			setCursor('crosshairCircle');
		} else if (tool === 'newPath') {
			// log('setting cursor to penPlus');
			setCursor('penPlus');
		} else if (tool === 'pathEdit') {
			// log('setting cursor to pen');
			setCursor('pen');
		} else if (tool === 'pathAddPoint') {
			// log('setting cursor to pen');
			setCursor('penPlus');
		} else if (tool === 'pan') {
			// log('setting cursor to move');
			setCursor('move');
		} else if (tool === 'kern') {
			// log('setting cursor to col-resize');
			setCursor('col-resize');
		} else {
			// log('defaulting cursor to pointer');
			setCursor('arrow');
		}
	} else {
		// log('NOT ON EDIT CANVAS setting cursor to default');
		setCursor('default');
	}

	// log('updateCursor', 'end');
}

export function setCursor(name) {
	if (document.body.style.cursor === name) {
		// log('setCursor', 'end');
		return;
	}
	// log('setCursor', 'start');
	// log('passed ' + name);

	const cur = [
		'auto',
		'default',
		'none',
		'context-menu',
		'help',
		'pointer',
		'progress',
		'wait',
		'cell',
		'crosshair',
		'text',
		'vertical-text',
		'alias',
		'copy',
		'move',
		'no-drop',
		'not-allowed',
		'e-resize',
		'n-resize',
		'ne-resize',
		'nw-resize',
		's-resize',
		'se-resize',
		'sw-resize',
		'w-resize',
		'ew-resize',
		'ns-resize',
		'nesw-resize',
		'nwse-resize',
		'col-resize',
		'row-resize',
		'all-scroll',
		'zoom-in',
		'zoom-out',
		'grab',
		'grabbing',
	];

	if (cur.indexOf(name + '-resize') > -1) {
		if (canResize(name)) name += '-resize';
		// log('SET -resize CURSOR');
	}

	if (cursors[name]) {
		document.body.style.cursor = cursors[name];
		// log('SET CUSTOM CURSOR:\t'+name);
	} else if (cur.indexOf(name) > -1) {
		document.body.style.cursor = name;
		// log('SET BUILT-IN CURSOR:\t'+name);
	} else {
		document.body.style.cursor = 'auto';
		// log('DEFAULT TO auto');
	}

	// log('setCursor', 'end');
}

//  ---------------------
//  CURSOR IMAGES
//  ---------------------

export let cursors = {};

cursors.arrow =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAdCAYAAACnmDyCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPJJREFUeNpiYNB2/M9ABcAEJqlgGNigLYtmUMEwoAEPv/7/v+Xszf+UGQY1iFLDmJA5uhpqZHuTCV2AXMOYsAmSYxgTLglSDWPCJ0mKYUyEFBBrGBMxzibGMCZiA5OQYUykRDE+w5hITXi4DGMiJztgM4yJ3CyKbhgTJQUHsmEspGiUN3PCKcdCoiHSJBkEs/nhqX2oElf3PyM6QUINMQFhZK8QStksWA25uv8stPRECVii8hqGIUDg7WLvR7yrQBIQbEyoTAdhfHnNBN0lyKAwNT6dlLAiuqbB5Sqi0lF7VVEj0FX1SEImlFamxrjCEiDAABxblO2iGQyVAAAAAElFTkSuQmCC") 0 0, default';
cursors.arrowPlus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAfCAYAAAD5h919AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVFJREFUeNpiYNB2/M9AB8AEJulgGdiiLYtm0MEyoAUPv/7/v+Xszf+0tQxqEa0tY0Lm6Gqo0SwYmdAFaGUZEzZBWljGhEuC2pYx4ZOkpmVMhBRQyzImYhRRwzImYhVSahkTKYopsYyJVA3kWsZETjCQYxkTuZFLqmVMlCRZUixjIcVgeTMnsh3FQqIl0lS1CObyh6f2oUpc3f+MahkWaokJCCMHFaUlAwtWS67uPwutfVEinhAA1dJws7gZGbH6CMMSIPB2sfcj1Vdw9dqOUkDMi9JmgGJjQm0KsIuxWIQuj8JH8pEJuk+QQWFqfDoxvgKpgalDZmP6jMiWEjZf4fURKKSAlhGVj9qrihqBLqxHEjJB8Q0o4oGGAbPDUyQfoqhhJLENaAzNT2exyPECLfqEZtFnIP4CohkZqA1AccLAIAnlPYdlchYG6oPP2NgAAQYAOpPju72GGAcAAAAASUVORK5CYII=") 0 0, default';
cursors.arrowSquare =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAgCAYAAADjaQM7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUpJREFUeNpiYNB2/M9AJ8AEJulkIdiyLYtm0MlCoCUPv/7/v+Xszf+0txBqGT0sZELm6Gqo0TRImdAFaGkhEzZBWlnIhEuCFhYy4ZOktoVMhBRQ00ImYhRRy0ImYhVSw0ImUhRTaiETqRoosZCJHBeSayETueFPjoVMlKQuUi1kIcVweTMnivIZC4kWSVPdMpgPHp7ahypxdf8zSixjBFeeSIZCLTKBcs/A5C7fuMXgE5cBspARvfIlaAtUDwsWH5kAJc9CDUJJDLgARgjgiGcmnBYBgbeLvR+yYrJLD21HKSDmZcJlEQhsndiwGT2pkwkkgRhsmQk2i2CgMDU+nSq+AwcjyBIcFoFAf0HCLCr5jrh81l5V1Aj0XT2SkAnNSv3KaN8GaPLFG+SE8xkVGrlEqAI58jnlliEnb0iqwwWeszBQD3wmJA8QYABwopweq1kh/wAAAABJRU5ErkJggg==") 0 0, default';
cursors.arrowSquareMinus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAgCAYAAADjaQM7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNpiYNB2/M9AJ8AEJulkIdiyLYtm0MlCoCUPv/7/v+Xszf+0txBqGT0sZELm6Gqo0TRImdAFaGkhEzZBWlnIhEuCFhYy4ZOktoVMhBRQ00ImYhRRy0ImYhVSw0ImUhRTaiETqRoosZCJHBeSayETueFPjoVMlKQuUi1kIcVweTMnivIZC4kWSVPdMpgPHp7ahypxdf8zSixjBFeeSIZCLTKBcs/A5C7fuMXgE5cBspARvfIlaAtUDwsWH5kAJc9CDUJJDLgARgjgiGcmnBYBgbeLvR+yYrJLD21HKSDmZcJlEQhsndiwGT2pkwkkgRhsmQk2i2CgMDU+nRjfgdSgY8wEQmwLDD0RwRIKmhyOOAN56DlR+ay9qqgRqKkeSciEZqV+ZbRvA9QneIOccD6jQiOXCFXgYKTcMuTkDUl1uMBzFgbqgc+E5AECDADsS6Ng0WO3RAAAAABJRU5ErkJggg==") 0 0, default';
cursors.arrowSquarePlus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAgCAYAAADjaQM7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVZJREFUeNpiYNB2/M9AJ8AEJulkIdiyLYtm0MlCoCUPv/7/v+Xszf+0txBqGT0sZELm6Gqo0TRImdAFaGkhEzZBWlnIhEuCFhYy4ZOktoVMhBRQ00ImYhRRy0ImYhVSw0ImUhRTaiETqRoosZCJHBeSayETueFPjoVMlKQuUi1kIcVweTMnivIZC4kWSVPdMpgPHp7ahypxdf8zSixjBFeeSIZCLTKBcs/A5C7fuMXgE5cBspARvfIlaAtUDwsWH5kAJc9CDUJJDLgARgjgiGcmnBYBgbeLvR+yYmJSHtZEpO0oBcS8TLgsAoGtExs2oyd1MoEkEIMtM8FmEQwUpsanE+M7kBqYOmQ2RS0wEEaxDIschlptR2NQUBKVz9qrihqBLq1HEjIhL+mT5kNjaFI+i+IzwqkR5LjnjAyUAuLKRSpZhpy8IakOF3jOwkA98JmQPECAAQAJ0cUPY7b/RgAAAABJRU5ErkJggg==") 0 0, default';

cursors.pen =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAcCAYAAABoMT8aAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQ1JREFUeNpiYNB2/M9AAWACkxQYAjYgJzGabEPABkhLiDNsWTSDTENAmoD44df//7ecvfmfVEOYkDm6GmpkuASoGGYzyBWkuoQJZjP5LkHzP8wVxLqECdlWdECcS7D4HdkVhFyCEQvYAH6X4PI3NHYIuYQJ3TyfuAysbFwuYSIUSZdv3GLA500MA9ori1DYuMIFBljQBaICfSA2aaoR1IzVAGRDSM5M5JYHJvJmThQYcHX/WWINAakBYeyJStvRGFsyBmFsCQuq1gCvIbhSJHKqZMSStI2B5BkQ8+GpfQS9xIg3l+IxABZmOKMRmJAcsQUsLCBBAQ+MAEaiSivk8IB6kTjQvnRzAyGNAAEGAP8cHYpMXpspAAAAAElFTkSuQmCC") 0 0, default';
cursors.penCircle =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAfCAYAAAAWRbZDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdBJREFUeNpiYNB2/M9AJ8AEJulkIdiynMRoulgItkxaQpxhy6IZdLAQZAEQP/z6//+Wszf/09JCJmSOroYajX0INBjmI5DvaOlDJpiP6ONDtPiC+Y4WPmRC9g06oL4PscQVsu+o6UOM1IgNUM+HuOIJmkqp6UMmdAGfuAysbGr4kImQgss3bjEQE9RkWdZeWYTCpsRwdMCCLhAV6APxgaYaVS3CahmyhTQtiOlRn5nImznRybKr+88SayFIDQiTm/wZkTK3MZA88/DUPqyWgADIEliiAYkB1RrKczNegOoPAJL9QKwA1fYAiAuBntmAqzQxRi5RcJUkGKUJyCIgu3DCgv+XX3wGYxAbqj8AX/FljNxUwIeRLLsPMhxdHmrhfcxgxFZmYglS9KAFAkEgfn957yYGPl4eFDWfPn9h0HX2AzEVgcH5AGfSB2ZqR2yJBpZIQIkKaAAjkWlDGOh4YZyWXV4z8wBeSyCpmAFIfwAlhnkr1mKYARV7DuWys+BzTntVUSPQgnoo1wRuASYo7J+9cD2IkRQRDLcIKAZi9hKOM9LrRfSk/xxqESyEHjBSvZjQdlQAxxEqeAtKIIw0KZeAiQEUR1DeT6BFb0EMgAADAK+Kb9V1QYuMAAAAAElFTkSuQmCC") 0 0, default';
cursors.penSquare =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXRJREFUeNpiYNB2/M9AR8AEJuloKdjCnMRoulkKtlBaQpxhy6IZdLIUZAkQP/z6//+Wszf/09pSJmSOroYaHXwKNBzmM5Avae1TJpjP6OdTtPiD+ZJWPmVC9hU6oI1PscQdsi+p7VOMVIoNUNenuOINmnqp7VMmdAGfuAysbGr5lImQgss3bjEQE+xkW9heWYTCptQCdMCCLhAV6APxiaYa1S3DaiGypTQvvOlVH5rImznR0cKr+88SaylIDQhTkjUYkQoAYyB55uGpfVgtAgGQRbCEBBIDqjWU52a8QJTlV/czYit1jJFLHlwlDkapg6X8RcbIDmJBc8VZoCQoeM+AuNh8S3YBoO0oBSQ/s2Dx+llwUBMIJjISmiTebAHM+I7YDIUlHFBCwx4vZGR8cBm6ZuYBoC+x+cgEGgrUK2ngZWlVUSPQonpqWISZLSitU/EkMHgUMDA8Z6FWCUJsImKkarkFSfqSeFRQz4dQ8JmQPECAAQCBICl0DbfiAAAAAABJRU5ErkJggg==") 0 0, default';
cursors.penPlus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAfCAYAAAAWRbZDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYFJREFUeNpiYNB2/M9AJ8AEJulkIdiynMRoulgItkxaQpxhy6IZdLAQZAEQP/z6//+Wszf/09JCJmSOroYajX0INBjmI5DvaOlDJpiP6ONDtPiC+Y4WPmRC9g06oL4PscQVsu+o6UOM1IgNUM+HuOIJmkqp6UMmdAGfuAysbGr4kImQgss3bjEQE9RkWdZeWYTCpsRwdMCCLhAV6APxgaYaVS3CahmyhTQtiOlRn5nImznRybKr+88SayFIDQhTnsG1HY2xFVUgjC2TQ9UaUM1CXCUJvtIExZFogBGrhQwMZ8AaT+0jGKzAaGBEtwwkDtILpKWBQp+Baj5jT/qQOGQkFCfocYzNJ0ALn4LVcjMy4sxn0EztCDRwP7rvkCwxgToMqwNgbLB+bUcpkA8ZCdYIUMvwWYLuM1gwIvFNgNRzFnx2tVcVNQIV1uOzBG4gKKiAPoAFHZIleBIIZXUjL9CyT2iWgRLHF8LBSL6loDiShPKeA0PkGd4EQiH4jI0NEGAAfK9aUlY6SugAAAAASUVORK5CYII=") 0 0, default';
cursors.penSquarePlus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAX5JREFUeNpiYNB2/M9AR8AEJuloKdjCnMRoulkKtlBaQpxhy6IZdLIUZAkQP/z6//+Wszf/09pSJmSOroYaHXwKNBzmM5Avae1TJpjP6OdTtPiD+ZJWPmVC9hU6oI1PscQdsi+p7VOMVIoNUNenuOINmnqp7VMmdAGfuAysbGr5lImQgss3bjEQE+xkW9heWYTCptQCdMCCLhAV6APxiaYa1S3DaiGypTQvvOlVH5rImznR0cKr+88SaylIDQhTkjUYkQoAYyB55uGpfVgtAgGQRbCEBBIDqjWU52a8QJTlV/czYit1jJFLHlwlDkapg6X8RcbIDmJBc8VZoCQoeM+AuNh8S0wBAPU9umekgORnFixePwsOagLBREZCk8SZD6EZ3xFo6H50lyJZZAJ1HFZHwNjo+nFaeHnNzANAXxJlEQzADMcapIQsBJelVUWNQM31hCwiL1tQWqfiSWDQ0DEB4ucs1CpBiE1EjFQttyBJXxKPCur5EAo+E5IHCDAApZM406Qi3E4AAAAASUVORK5CYII=") 0 0, default';
cursors.penMinus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAdCAYAAABbjRdIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUpJREFUeNpiYNB2/M9AJ8AEJulkIdiynMRoulgItkxaQpxhy6IZdLAQZAEQP/z6//+Wszf/09JCJmSOroYajX0INBjmI5DvaOlDJpiP6ONDtPiC+Y4WPmRC9g06oL4PscQVsu+o6UOM1IgNUM+HuOIJmkqp6UMmdAGfuAysbGr4kImQgss3bjEQE9RkWdZeWYTCpsRwdMCCLhAV6APxgaYaVS3CahmyhTQtiOlRn5nImznRybKr+88SayFIDQhTnsG1HY2xFVUgjC2TQ9UaUM1CXCUJuaUJI1YLGRjOgJgPT+0jGKzAaGAkP+lD4pCRkKvR4xgcErjUcjMy4sxn0EztCDRwP7rvkCwxgToMpwPgoaPtKAVkfmYkWCNALcNnCUGfmTmZAKnnLPjsaq8qagQqrMdnCUpQQXwgSXwCoaxu5AWSvDhkPwMEGAAs6y0GuzCF+gAAAABJRU5ErkJggg==") 0 0, default';
cursors.penSquareMinus =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXZJREFUeNpiYNB2/M9AR8AEJuloKdjCnMRoulkKtlBaQpxhy6IZdLIUZAkQP/z6//+Wszf/09pSJmSOroYaHXwKNBzmM5Avae1TJpjP6OdTtPiD+ZJWPmVC9hU6oI1PscQdsi+p7VOMVIoNUNenuOINmnqp7VMmdAGfuAysbGr5lImQgss3bjEQE+xkW9heWYTCptQCdMCCLhAV6APxiaYa1S3DaiGypTQvvOlVH5rImznR0cKr+88SaylIDQhTkjUYkQoAYyB55uGpfVgtAgGQRbCEBBIDqjWU52a8QJTlV/czYit1jJFLHlwlDkapg6X8RcbIDmJBc8VZoCQoeM+AuNh8S3YBoO0oBSQ/s2Dx+llwUBMIJjISmiTOfAjN+I5AQ/ej+xLJIhOo4/A6Al0/Tgsvr5l5AOhLoizCZTjRJQ28LK0qagRaVE/IIvKyBaV1Kh7fQUPHBIifs1CrBCE2ETFStdyCJH1JPCqo50Mo+ExIHiDAAEFmMjxTYFr1AAAAAElFTkSuQmCC") 0 0, default';

cursors.crosshair =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNpiYCAFaDvOB+L/YJpmAGjBw6///4MtIgEwMdABjFoyasngsWSBvJkTmGYYbIARWkQkEPIBw9X9iViLGSL0MoKLilP78KoCB9HV/YywogWZTYxeFmg4E/YJDMAsQMQR8XoHDxgt6kctGbVkaBf1AAEGAMBRMaRlDAehAAAAAElFTkSuQmCC") 12 12, crosshair';
cursors.crosshairCircle =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASVJREFUeNpiYCAFaDvOB+L/YJquAGjpw6///4MtpxAwMQwQGLV41OJRixfImzmBaYahChihxV8CIZ8yXN2fiLUIJVcvrBjEh1GKSDQ2SXqRAAs03gi7Ggau7mdEi3Pi9Q49MFotjlqMGTUKYEw3i7UdA4D4PpAFwSA2SIymFkMsWF+YGq9wee8mBhAGsUFi6JZTN1UDfVc4YQFGCQYSg4YCzYJaISkiGEMQKgaKc92BqhaFgZYLk2YxqJYBldVYaxs4eDBvxVoMQajYcyD+DMRczFQPaDHFhyfOXYwA1SQyUhIMn758AVvaP3shSLYR5DAg/sFIs+zEwNAPjlMIAPm0F4gPwEKFkeYFCChOUcFbYFTR2GKI5QKgOIXyvgEt/QBiAAQYAJAZwoY0giMOAAAAAElFTkSuQmCC") 12 12, crosshair';
cursors.crosshairSquare =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpiYCAFaDvOB+L/YJquAGjpw6///4MtpxAwMQwQGLV41OJRixfImzmBaYahChihxV8CIZ8yXN2fiLUIJVcvrBjEh1GKSDQ2SXqRAAs03gi7Ggau7mdEi3Pi9Q49MFotDkWLWWgQHQ4EVFwA5owPLDTwzH4C8o5AfIAWFjOsnNHPYGGkjyEOLecHLI5lgNEhOxAWcwEx54BVi6TFMaSWSRyc2QkIrt26Q0R9TINilYCKdFB2YqRZEtJ2lAKSkjhkP7PQMPV+xiP3EyDAAKd2fwJMBs75AAAAAElFTkSuQmCC") 12 12, crosshair';

cursors.rotate =
	'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAYAAAC5UQwxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZlJREFUeNq8lr1OwzAQgHNRNoQET9AtokKZGjG3zIzMrPBIzDwDM91RO1UI2o0nAAkxB1+bC87lYp+dwElVq9q+z3e+P0i0cr6onOsvS9DocG56/65OJheXH/j78eHeqevq5u5w5vnpdHIEn30XBi2oOMudwM3brh9sYKgH1zLpMMK0IBLaR+fqCwPBaB0k0+0N1iWcQGNRx2K0yNaFOsAHI1AxzReb192XaN00PzZrSw5GqKTrF7beVub9mg/+V1zfzs33TBGBs3pvSwfX1wQJ39jAQkUD5NbtFzRWSe/PvMSBKY8yK5HXwTAh2LikyRiihKFktJlFUhla8ijh/cDh7ixDnJENdmfgW6dD3i3mWDrAMhgNuC8EfyaY4FZ1wMSNdZfOQvbo2nYUD3R0+393awyUGoH/WViVj4bWBdwfC8zKVgBpgqjeZ3cLCQodaJKseNfW1EppBmrqshWYneTFpovjgjSjaIYoF6x3TCSoNBz5xJpbSqnOgvNND7LSgFsgR1EHVcpY4F6X0lTn6R4QlKsjtKkfAQYAJzeYBJBt3wMAAAAASUVORK5CYII=") 14 15, ew-resize';
