//var me={token:null,color:null};
var me = {};
var game_status = {};
var board = {};
var last_update = new Date().getTime();
var timer = null;

$(function () {
  draw_empty_board();
  fill_board();
  game_status_update();
  $('#nmm_login').click(login_to_game);
  $('#nmm_reset').click(reset_board);
  $('#do_move').click(do_prepremove);
  $('#removepawn').hide(1000);
  $('#do_remove').click(removepawn2);
});

function draw_empty_board(p) {
  var t = '<table id="nmm_table">';
  for (var i = 7; i > 0; i--) {
    t += '<tr>';
    for (var j = 1; j < 8; j++) {
      t +=
        '<td class="nmm_square" id="square_' +
        j +
        '_' +
        i +
        '">' +
        j +
        ',' +
        i +
        '</td>';
    }
    t += '</tr>';
  }
  t += '</table>';

  $('#nmm_board').html(t);
}

function fill_board() {
  $.ajax({
    url: 'NineMenMorris.php/board/',
    method: 'get',
    success: fill_board_by_data,
  });
}

function reset_board() {
  $.ajax({
    url: 'NineMenMorris.php/board/',
    headers: { 'X-Token': me.token },
    method: 'POST',
    success: fill_board_by_data,
  });
  $('#move_div').hide();
  $('#game_initializer').show(2000);
  varobj2.fr = varobj2.ff;
  $('#win_info').html('');
  document.getElementById('username').value = '';
  document.getElementById('username').select();
}

function fill_board_by_data(data, x, y) {
  for (var i = 0; i < data.length; i++) {
    var o = data[i];
    var id = '#square_' + o.X + '_' + o.Y;
    var c = o.Bcolor;
    var im = document.createElement('img');
    im.classList.add('piece');
    if (o.Bcolor == 'r') {
      im.src = 'images/B.png';
    } else if (o.Bcolor == 'g') {
      im.src = 'images/W.png';
    }

    if (o.piece_color == 'W') {
      im.classList.add('W');
      im.src = 'images/wpawn.png';
    } else if (o.piece_color == 'B') {
      im.classList.add('B');
      im.src = 'images/bpawn.png';
    }

    $(id)
      .addClass(o.Bcolor + '_square')
      .html(im);
  }
}

function login_to_game() {
  if ($('#username').val() == '') {
    alert('You have to set a username');
    return;
  }
  var p_color = $('#pcolor').val();
  draw_empty_board(p_color);
  fill_board();

  $.ajax({
    url: 'NineMenMorris.php/players/' + p_color,
    method: 'PUT',
    dataType: 'json',
    headers: { 'X-Token': me.token },
    contentType: 'application/json',
    data: JSON.stringify({
      username: $('#username').val(),
      piece_color: p_color,
    }),
    success: login_result,
    error: login_error,
  });
}

function login_result(data) {
  me = data[0];
  $('#game_initializer').hide();
  update_info();
  game_status_update();
}

function login_error(data, y, z, c) {
  var x = data.responseJSON;
  alert(x.errormesg);
}

function game_status_update() {
  clearTimeout(timer);
  $.ajax({ url: 'NineMenMorris.php/status/', success: update_status });
}

function update_status(data) {
  last_update = new Date().getTime();
  var game_stat_old = game_status;
  game_status = data[0];
  update_info();
  clearTimeout(timer);
  if (
    game_status.p_turn == me.piece_color &&
    me.piece_color != null &&
    game_status.status != 'ended'
  ) {
    //if($('#removepawn').is(':visible')){
    //	;
    //}else{
    x = 0;
    // do play
    if (game_stat_old.p_turn != game_status.p_turn) {
      fill_board();
    }
    $('#move_div').show(1000);
    setTimeout(function () {
      game_status_update();
    }, 3000);
    //}
  } else {
    // must wait for something
    $('#move_div').hide(1000);
    setTimeout(function () {
      game_status_update();
    }, 4000);
  }

  if (varobj2.fr == W) {
    $.ajax({
      url: 'NineMenMorris.php/winW/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
    });
    //$('#win_info').html("Player "+game_status.result+" is the winner!!!!!");
  } else if (varobj2.fr == B) {
    $.ajax({
      url: 'NineMenMorris.php/winB/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
    });
    //$('#win_info').html("Player "+game_status.result+" is the winner!!!!!");
  }

  if (
    game_status.status == 'ended' &&
    (game_status.result == 'W' || game_status.result == 'B')
  ) {
    $('#win_info').html('Player ' + game_status.result + ' is the winner!!!!!');
  }
}

function update_info() {
  $('#game_info').html(
    'I am Player: ' +
      me.piece_color +
      ', my name is ' +
      me.username +
      '<br>Token=' +
      me.token +
      '<br>Game state: ' +
      game_status.status +
      ', ' +
      game_status.p_turn +
      ' must play now.'
  );
}

function do_prepremove() {
  var p_color = $('#pcolor').val();
  $.ajax({
    url: 'NineMenMorris.php/playernumber/' + p_color,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: do_premove,
    error: login_error,
  });
}

function do_premove(data) {
  var s = $('#the_move').val();
  var a = s.trim().split(/[ ]+/);
  var d = document.getElementById('square_' + a[0] + '_' + a[1]);
  var z = document.getElementById('square_' + a[2] + '_' + a[3]);
  var pnumb = data[0];
  //
  if (
    pnumb.playernumber < 9 &&
    ($(z).children().hasClass('W') || $(z).children().hasClass('B'))
  ) {
    alert('There is already a pawn in that location');
  } else if (d.classList.contains('g_square')) {
    //
    if (pnumb.playernumber == 9) {
      do_move();
      checkWtriangles(varobj);
    } else if (pnumb.playernumber < 9) {
      addmove();
      checkWtriangles(varobj);
    }
  } else {
    alert('Illegal Move');
  }
  game_status_update();
  fill_board();
}

function addmove() {
  var s = $('#the_move').val();
  var a = s.trim().split(/[ ]+/);
  if (a.length != 3) {
    alert('Must give 3 numbers');
    return;
  }
  //me.playerNumber += 1;
  //var im;
  //var id = '#square_'+ a[0] +'_' + a[1];
  //if (a[2] == 'B') {
  //	 im ='<img class="piece" src="images/K.png">';
  //	me.playerNumber += 1;
  //} else if (a[2] == 'W') {
  //	 im ='<img class="piece" src="images/K.png">';
  //	me.playerNumber += 1;
  //}
  //$(id).addClass(me.Bcolor+'_square').html(im);
  var p_color = $('#pcolor').val();
  if (p_color != a[2]) {
    alert('Wrong Color');
    return;
  }
  var d = document.getElementById('square_' + a[0] + '_' + a[1]);
  if (
    d.childNodes[0].classList.contains('W') ||
    d.childNodes[0].classList.contains('B')
  ) {
    alert('There is already a pawn there');
    return;
  }
  $.ajax({
    url: 'NineMenMorris.php/putpiece/' + a[0] + '/' + a[1] + '/' + a[2],
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      x: a[0],
      y: a[1],
      piece_color: a[2],
      username: me.username,
    }),
    headers: { 'X-Token': me.token },
    success: move_result,
    error: login_error,
  });

  game_status_update();
  fill_board();
}

function do_move() {
  var s = $('#the_move').val();

  var a = s.trim().split(/[ ]+/);
  if (a.length != 4) {
    alert('Must give 4 numbers');
    return;
  }
  $.ajax({
    url: 'NineMenMorris.php/board/piece/' + a[0] + '/' + a[1],
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ x: a[2], y: a[3], token: me.token }),
    headers: { 'X-Token': me.token },
    success: move_result,
    error: login_error,
  });

  game_status_update();
  fill_board();
}

let varobj2 = {
  fr: no,
  ff: no,
};

let varobj = {
  one1: One1_14_17,
  one11: One1_14_17,
  one2: One1_41_71,
  one22: One1_41_71,
  one3: One7_47_77,
  one33: One7_47_77,
  one4: seven1_74_77,
  one44: seven1_74_77,
  one5: two2_42_62,
  one55: two2_42_62,
  one6: two2_24_26,
  one66: two2_24_26,
  one7: two6_46_66,
  one77: two6_46_66,
  one8: six2_64_66,
  one88: six2_64_66,
  one9: three3_43_53,
  one99: three3_43_53,
  one10: three3_34_35,
  one1010: three3_34_35,
  one111: three5_45_55,
  one11111: three5_45_55,
  one12: five3_54_55,
  one1212: five3_54_55,
  one13: one4_24_34,
  one1313: one4_24_34,
  one14: five4_64_74,
  one1414: five4_64_74,
  one15: four1_42_43,
  one1515: four1_42_43,
  one16: four5_46_47,
  one1616: four5_46_47,
  bone1: bOne1_14_17,
  bone11: bOne1_14_17,
  bone2: bOne1_41_71,
  bone22: bOne1_41_71,
  bone3: bOne7_47_77,
  bone33: bOne7_47_77,
  bone4: bseven1_74_77,
  bone44: bseven1_74_77,
  bone5: btwo2_42_62,
  bone55: btwo2_42_62,
  bone6: btwo2_24_26,
  bone66: btwo2_24_26,
  bone7: btwo6_46_66,
  bone77: btwo6_46_66,
  bone8: bsix2_64_66,
  bone88: bsix2_64_66,
  bone9: bthree3_43_53,
  bone99: bthree3_43_53,
  bone10: bthree3_34_35,
  bone1010: bthree3_34_35,
  bone111: bthree5_45_55,
  bone11111: bthree5_45_55,
  bone12: bfive3_54_55,
  bone1212: bfive3_54_55,
  bone13: bone4_24_34,
  bone1313: bone4_24_34,
  bone14: bfive4_64_74,
  bone1414: bfive4_64_74,
  bone15: bfour1_42_43,
  bone1515: bfour1_42_43,
  bone16: bfour5_46_47,
  bone1616: bfour5_46_47,
  nu: no,
};

function move_result(data) {
  game_status_update();
  fill_board_by_data(data);

  var p_color = $('#pcolor').val();
  if (p_color == 'W') {
    varobj.one1(varobj);
    varobj.one2(varobj);
    varobj.one3(varobj);
    varobj.one4(varobj);
    varobj.one5(varobj);
    varobj.one6(varobj);
    varobj.one7(varobj);
    varobj.one8(varobj);
    varobj.one9(varobj);
    varobj.one10(varobj);
    varobj.one111(varobj);
    varobj.one12(varobj);
    varobj.one13(varobj);
    varobj.one14(varobj);
    varobj.one15(varobj);
    varobj.one16(varobj);
  }

  if (p_color == 'B') {
    varobj.bone1(varobj);
    varobj.bone2(varobj);
    varobj.bone3(varobj);
    varobj.bone4(varobj);
    varobj.bone5(varobj);
    varobj.bone6(varobj);
    varobj.bone7(varobj);
    varobj.bone8(varobj);
    varobj.bone9(varobj);
    varobj.bone10(varobj);
    varobj.bone111(varobj);
    varobj.bone12(varobj);
    varobj.bone13(varobj);
    varobj.bone14(varobj);
    varobj.bone15(varobj);
    varobj.bone16(varobj);
  }

  /*var a = 1;
	var b = 1;
	var c = 7;
	var e = 7;
	for(i=a;i<=c;i++){
		var n = 0;
		var k = 0;
		for(j=b;j<=e;j++){
			var d = document.getElementById('square_'+i+'_'+j);
			if(d.childNodes[0].classList.contains('W')){
				n += 1;
			}else if(d.childNodes[0].classList.contains('B')){
				k += 1;
			}
			if(k == 3 ){
				alert('asdasd');
			}else if(n == 3){
				alert('asdasd');
			}
		}
	}
	*/
}

function One1_14_17(varobj) {
  if (
    square_1_1.childNodes[0].classList.contains('W') &&
    square_1_4.childNodes[0].classList.contains('W') &&
    square_1_7.childNodes[0].classList.contains('W')
  ) {
    varobj.one1 = varobj.nu;
    removePawn();
  }
}

function One1_41_71(varobj) {
  if (
    square_1_1.childNodes[0].classList.contains('W') &&
    square_4_1.childNodes[0].classList.contains('W') &&
    square_7_1.childNodes[0].classList.contains('W')
  ) {
    varobj.one2 = varobj.nu;
    removePawn();
  }
}

function One7_47_77(varobj) {
  if (
    square_1_7.childNodes[0].classList.contains('W') &&
    square_4_7.childNodes[0].classList.contains('W') &&
    square_7_7.childNodes[0].classList.contains('W')
  ) {
    varobj.one3 = varobj.nu;
    removePawn();
  }
}

function seven1_74_77(varobj) {
  if (
    square_7_1.childNodes[0].classList.contains('W') &&
    square_7_4.childNodes[0].classList.contains('W') &&
    square_7_7.childNodes[0].classList.contains('W')
  ) {
    varobj.one4 = varobj.nu;
    removePawn();
  }
}

function two2_42_62(varobj) {
  if (
    square_2_2.childNodes[0].classList.contains('W') &&
    square_4_2.childNodes[0].classList.contains('W') &&
    square_6_2.childNodes[0].classList.contains('W')
  ) {
    varobj.one5 = varobj.nu;
    removePawn();
  }
}

function two2_24_26(varobj) {
  if (
    square_2_2.childNodes[0].classList.contains('W') &&
    square_2_4.childNodes[0].classList.contains('W') &&
    square_2_6.childNodes[0].classList.contains('W')
  ) {
    varobj.one6 = varobj.nu;
    removePawn();
  }
}

function two6_46_66(varobj) {
  if (
    square_2_6.childNodes[0].classList.contains('W') &&
    square_4_6.childNodes[0].classList.contains('W') &&
    square_6_6.childNodes[0].classList.contains('W')
  ) {
    varobj.one7 = varobj.nu;
    removePawn();
  }
}

function six2_64_66(varobj) {
  if (
    square_6_2.childNodes[0].classList.contains('W') &&
    square_6_4.childNodes[0].classList.contains('W') &&
    square_6_6.childNodes[0].classList.contains('W')
  ) {
    varobj.one8 = varobj.nu;
    removePawn();
  }
}

function three3_43_53(varobj) {
  if (
    square_3_3.childNodes[0].classList.contains('W') &&
    square_4_3.childNodes[0].classList.contains('W') &&
    square_5_3.childNodes[0].classList.contains('W')
  ) {
    varobj.one9 = varobj.nu;
    removePawn();
  }
}

function three3_34_35(varobj) {
  if (
    square_3_3.childNodes[0].classList.contains('W') &&
    square_3_4.childNodes[0].classList.contains('W') &&
    square_3_5.childNodes[0].classList.contains('W')
  ) {
    varobj.one10 = varobj.nu;
    removePawn();
  }
}

function three5_45_55(varobj) {
  if (
    square_3_5.childNodes[0].classList.contains('W') &&
    square_4_5.childNodes[0].classList.contains('W') &&
    square_5_5.childNodes[0].classList.contains('W')
  ) {
    varobj.one111 = varobj.nu;
    removePawn();
  }
}

function five3_54_55(varobj) {
  if (
    square_5_3.childNodes[0].classList.contains('W') &&
    square_5_4.childNodes[0].classList.contains('W') &&
    square_5_5.childNodes[0].classList.contains('W')
  ) {
    varobj.one12 = varobj.nu;
    removePawn();
  }
}

function one4_24_34(varobj) {
  if (
    square_1_4.childNodes[0].classList.contains('W') &&
    square_2_4.childNodes[0].classList.contains('W') &&
    square_3_4.childNodes[0].classList.contains('W')
  ) {
    varobj.one13 = varobj.nu;
    removePawn();
  }
}

function five4_64_74(varobj) {
  if (
    square_5_4.childNodes[0].classList.contains('W') &&
    square_6_4.childNodes[0].classList.contains('W') &&
    square_7_4.childNodes[0].classList.contains('W')
  ) {
    varobj.one14 = varobj.nu;
    removePawn();
  }
}

function four1_42_43(varobj) {
  if (
    square_4_1.childNodes[0].classList.contains('W') &&
    square_4_2.childNodes[0].classList.contains('W') &&
    square_4_3.childNodes[0].classList.contains('W')
  ) {
    varobj.one15 = varobj.nu;
    removePawn();
  }
}

function four5_46_47(varobj) {
  if (
    square_4_5.childNodes[0].classList.contains('W') &&
    square_4_6.childNodes[0].classList.contains('W') &&
    square_4_7.childNodes[0].classList.contains('W')
  ) {
    varobj.one16 = varobj.nu;
    removePawn();
  }
}

function bOne1_14_17(varobj) {
  if (
    square_1_1.childNodes[0].classList.contains('B') &&
    square_1_4.childNodes[0].classList.contains('B') &&
    square_1_7.childNodes[0].classList.contains('B')
  ) {
    varobj.bone1 = varobj.nu;
    removePawn();
  }
}

function bOne1_41_71(varobj) {
  if (
    square_1_1.childNodes[0].classList.contains('B') &&
    square_4_1.childNodes[0].classList.contains('B') &&
    square_7_1.childNodes[0].classList.contains('B')
  ) {
    varobj.bone2 = varobj.nu;
    removePawn();
  }
}

function bOne7_47_77(varobj) {
  if (
    square_1_7.childNodes[0].classList.contains('B') &&
    square_4_7.childNodes[0].classList.contains('B') &&
    square_7_7.childNodes[0].classList.contains('B')
  ) {
    varobj.bone3 = varobj.nu;
    removePawn();
  }
}

function bseven1_74_77(varobj) {
  if (
    square_7_1.childNodes[0].classList.contains('B') &&
    square_7_4.childNodes[0].classList.contains('B') &&
    square_7_7.childNodes[0].classList.contains('B')
  ) {
    varobj.bone4 = varobj.nu;
    removePawn();
  }
}

function btwo2_42_62(varobj) {
  if (
    square_2_2.childNodes[0].classList.contains('B') &&
    square_4_2.childNodes[0].classList.contains('B') &&
    square_6_2.childNodes[0].classList.contains('B')
  ) {
    varobj.bone5 = varobj.nu;
    removePawn();
  }
}

function btwo2_24_26(varobj) {
  if (
    square_2_2.childNodes[0].classList.contains('B') &&
    square_2_4.childNodes[0].classList.contains('B') &&
    square_2_6.childNodes[0].classList.contains('B')
  ) {
    varobj.bone6 = varobj.nu;
    removePawn();
  }
}

function btwo6_46_66(varobj) {
  if (
    square_2_6.childNodes[0].classList.contains('B') &&
    square_4_6.childNodes[0].classList.contains('B') &&
    square_6_6.childNodes[0].classList.contains('B')
  ) {
    varobj.bone7 = varobj.nu;
    removePawn();
  }
}

function bsix2_64_66(varobj) {
  if (
    square_6_2.childNodes[0].classList.contains('B') &&
    square_6_4.childNodes[0].classList.contains('B') &&
    square_6_6.childNodes[0].classList.contains('B')
  ) {
    varobj.bone8 = varobj.nu;
    removePawn();
  }
}

function bthree3_43_53(varobj) {
  if (
    square_3_3.childNodes[0].classList.contains('B') &&
    square_4_3.childNodes[0].classList.contains('B') &&
    square_5_3.childNodes[0].classList.contains('B')
  ) {
    varobj.bone9 = varobj.nu;
    removePawn();
  }
}

function bthree3_34_35(varobj) {
  if (
    square_3_3.childNodes[0].classList.contains('B') &&
    square_3_4.childNodes[0].classList.contains('B') &&
    square_3_5.childNodes[0].classList.contains('B')
  ) {
    varobj.bone10 = varobj.nu;
    removePawn();
  }
}

function bthree5_45_55(varobj) {
  if (
    square_3_5.childNodes[0].classList.contains('B') &&
    square_4_5.childNodes[0].classList.contains('B') &&
    square_5_5.childNodes[0].classList.contains('B')
  ) {
    varobj.bone111 = varobj.nu;
    removePawn();
  }
}

function bfive3_54_55(varobj) {
  if (
    square_5_3.childNodes[0].classList.contains('B') &&
    square_5_4.childNodes[0].classList.contains('B') &&
    square_5_5.childNodes[0].classList.contains('B')
  ) {
    varobj.bone12 = varobj.nu;
    removePawn();
  }
}

function bone4_24_34(varobj) {
  if (
    square_1_4.childNodes[0].classList.contains('B') &&
    square_2_4.childNodes[0].classList.contains('B') &&
    square_3_4.childNodes[0].classList.contains('B')
  ) {
    varobj.bone13 = varobj.nu;
    removePawn();
  }
}

function bfive4_64_74(varobj) {
  if (
    square_5_4.childNodes[0].classList.contains('B') &&
    square_6_4.childNodes[0].classList.contains('B') &&
    square_7_4.childNodes[0].classList.contains('B')
  ) {
    varobj.bone14 = varobj.nu;
    removePawn();
  }
}

function bfour1_42_43(varobj) {
  if (
    square_4_1.childNodes[0].classList.contains('B') &&
    square_4_2.childNodes[0].classList.contains('B') &&
    square_4_3.childNodes[0].classList.contains('B')
  ) {
    varobj.bone15 = varobj.nu;
    removePawn();
  }
}

function bfour5_46_47(varobj) {
  if (
    square_4_5.childNodes[0].classList.contains('B') &&
    square_4_6.childNodes[0].classList.contains('B') &&
    square_4_7.childNodes[0].classList.contains('B')
  ) {
    varobj.bone16 = varobj.nu;
    removePawn();
  }
}

function no() {}

function removePawn() {
  $('#removepawn').show(1000);
  var p_color = $('#pcolor').val();
  if (game_status.p_turn == p_color && game_status.p_turn == 'W') {
    $.ajax({
      url: 'NineMenMorris.php/changeB/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: { 'X-Token': me.token },
      success: pawn,
    });
  }

  if (game_status.p_turn == p_color && game_status.p_turn == 'B') {
    $.ajax({
      url: 'NineMenMorris.php/changeW/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: { 'X-Token': me.token },
      success: pawn,
    });
  }
}

function pawn() {
  game_status_update();
  fill_board();
}

function removepawn2() {
  var s = $('#the_remove').val();
  var a = s.trim().split(/[ ]+/);
  if (a.length != 3) {
    alert('Must give 3 numbers');
    return;
  }

  var p_color = $('#pcolor').val();
  if (p_color != a[2]) {
    alert('Wrong Color');
    return;
  }
  var d = document.getElementById('square_' + a[0] + '_' + a[1]);

  if (p_color == 'W' && d.childNodes[0].classList.contains('W')) {
    alert('Cant Remove Your Own Pawn');
    return;
  } else if (p_color == 'B' && d.childNodes[0].classList.contains('B')) {
    alert('Cant Remove Your Own Pawn');
    return;
  }
  $.ajax({
    url: 'NineMenMorris.php/removepiece/' + a[0] + '/' + a[1] + '/' + a[2],
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      x: a[0],
      y: a[1],
      piece_color: a[2],
      username: me.username,
    }),
    headers: { 'X-Token': me.token },
    success: removesuccess,
    error: login_error,
  });
}

function removesuccess(data) {
  var p_color = $('#pcolor').val();
  var d = document.getElementById('square_' + data['a'] + '_' + data['b']);
  if (d.classList.contains('g_square')) {
    if (data['c'] == 'W') {
      if (d.childNodes[0].classList.contains('W')) {
        alert('wrong pawn');
        return;
      } else if (d.childNodes[0].classList.contains('B')) {
        if (data['c'] == 'W') {
          d.childNodes[0].classList.remove('W');
        } else if (data['c'] == 'B') {
          d.childNodes[0].classList.remove('B');
        }
      } else {
        alert('there is no pawn there');
        return;
      }
    } else if (data['c'] == 'B') {
      if (d.childNodes[0].classList.contains('B')) {
        alert('wrong pawn');
        return;
      } else if (d.childNodes[0].classList.contains('W')) {
        if (data['c'] == 'W') {
          d.childNodes[0].classList.remove('W');
        } else if (data['c'] == 'B') {
          d.childNodes[0].classList.remove('B');
        }
      } else {
        alert('there is no pawn there');
        return;
      }
    }
  } else {
    alert('illegal pawn remove');
    return;
  }
  var id = '#square_' + data['a'] + '_' + data['b'];
  var c = data['c'];
  var im = document.createElement('img');
  im.classList.add('piece');
  im.classList.remove('W');
  im.classList.remove('B');
  im.src = 'images/W.png';

  $(id)
    .addClass(data['c'] + '_square')
    .html(im);

  $('#removepawn').hide(1000);

  var p_color = $('#pcolor').val();
  console.log(p_color);
  if (game_status.p_turn == p_color && game_status.p_turn == 'W') {
    $.ajax({
      url: 'NineMenMorris.php/changeW/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: { 'X-Token': me.token },
      success: pawn,
    });
  }

  if (game_status.p_turn == p_color && game_status.p_turn == 'B') {
    $.ajax({
      url: 'NineMenMorris.php/changeB/',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: { 'X-Token': me.token },
      success: pawn,
    });
  }

  var x = data['a'];
  var y = data['b'];
  $('#removepawn').hide(1000);
  //	if(p_color == 'W'){
  //$('#move_div').show(1000);
  //		checktriangles(varobj, x, y);
  //	}else if(p_color == 'B'){
  //$('#move_div').show(1000);
  //		checkbtriangles(varobj, x, y);
  //	}
  checkWtriangles(varobj);

  var pcol;

  if (p_color == 'W') {
    pcol = 'B';
  } else if (p_color == 'B') {
    pcol = 'W';
  }

  $.ajax({
    url: 'NineMenMorris.php/counternumber/' + pcol,
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    headers: { 'X-Token': me.token },
    success: pawn2,
    error: login_error,
  });
}

function pawn2() {
  game_status_update();
  fill_board();
  var pcol = $('#pcolor').val();
  if (pcol == 'W') {
    pcol = 'B';
  } else if (pcol == 'B') {
    pcol = 'W';
  }

  $.ajax({
    url: 'NineMenMorris.php/getcounternumber/' + pcol,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: { 'X-Token': me.token },
    success: win,
    error: login_error,
  });
}

function win(data) {
  var p_color = $('#pcolor').val();
  game_status_update();
  fill_board();
  var cn = data[0];
  if (cn.counterNumber < 3 && p_color == 'W') {
    varobj2.fr = W;
    return;
  } else if (cn.counterNumber < 3 && p_color == 'B') {
    varobj2.fr = B;
    return;
  }
}

function W() {}

function B() {}

function checkWtriangles(varobj) {
  for (i = 1; i <= 7; i++) {
    for (j = 1; j <= 7; j++) {
      var d = document.getElementById('square_' + i + '_' + j);
      if (d.childNodes[0].classList.contains('W')) {
      } else if (d.childNodes[0].classList.contains('B')) {
      } else {
        checkbtriangles(varobj, i, j);
        checktriangles(varobj, i, j);
      }
    }
  }
  game_status_update();
}

function checkbtriangles(varobj, x, y) {
  if (x == 1 && y == 1) {
    varobj.one1 = varobj.one11;
    varobj.one2 = varobj.one22;
  } else if (x == 1 && y == 4) {
    varobj.one1 = varobj.one11;
    varobj.one13 = varobj.one1313;
  } else if (x == 1 && y == 7) {
    varobj.one1 = varobj.one11;
    varobj.one3 = varobj.one33;
  } else if (x == 2 && y == 2) {
    varobj.one6 = varobj.one66;
    varobj.one5 = varobj.one55;
  } else if (x == 2 && y == 4) {
    varobj.one6 = varobj.one66;
    varobj.one13 = varobj.one1313;
  } else if (x == 2 && y == 6) {
    varobj.one7 = varobj.one77;
    varobj.one6 = varobj.one66;
  } else if (x == 3 && y == 3) {
    varobj.one9 = varobj.one99;
    varobj.one10 = varobj.one1010;
  } else if (x == 3 && y == 4) {
    varobj.one10 = varobj.one1010;
    varobj.one13 = varobj.one1313;
  } else if (x == 3 && y == 5) {
    varobj.one111 = varobj.one11111;
    varobj.one10 = varobj.one1010;
  } else if (x == 4 && y == 1) {
    varobj.one15 = varobj.one1515;
    varobj.one2 = varobj.one22;
  } else if (x == 4 && y == 2) {
    varobj.one5 = varobj.one55;
    varobj.one15 = varobj.one1515;
  } else if (x == 4 && y == 3) {
    varobj.one9 = varobj.one99;
    varobj.one15 = varobj.one1515;
  } else if (x == 4 && y == 5) {
    varobj.one111 = varobj.one11111;
    varobj.one16 = varobj.one1616;
  } else if (x == 4 && y == 6) {
    varobj.one7 = varobj.one77;
    varobj.one16 = varobj.one1616;
  } else if (x == 4 && y == 7) {
    varobj.one3 = varobj.one33;
    varobj.one16 = varobj.one1616;
  } else if (x == 5 && y == 3) {
    varobj.one12 = varobj.one1212;
    varobj.one9 = varobj.one99;
  } else if (x == 5 && y == 4) {
    varobj.one12 = varobj.one1212;
    varobj.one14 = varobj.one1414;
  } else if (x == 5 && y == 5) {
    varobj.one12 = varobj.one1212;
    varobj.one111 = varobj.one11111;
  } else if (x == 6 && y == 2) {
    varobj.one8 = varobj.one88;
    varobj.one5 = varobj.one55;
  } else if (x == 6 && y == 4) {
    varobj.one8 = varobj.one88;
    varobj.one14 = varobj.one1414;
  } else if (x == 6 && y == 6) {
    varobj.one8 = varobj.one88;
    varobj.one7 = varobj.one77;
  } else if (x == 7 && y == 1) {
    varobj.one4 = varobj.one44;
    varobj.one2 = varobj.one22;
  } else if (x == 7 && y == 4) {
    varobj.one4 = varobj.one44;
    varobj.one14 = varobj.one1414;
  } else if (x == 7 && y == 7) {
    varobj.one4 = varobj.one44;
    varobj.one3 = varobj.one33;
  }
}

function checktriangles(varobj, x, y) {
  if (x == 1 && y == 1) {
    varobj.bone1 = varobj.bone11;
    varobj.bone2 = varobj.bone22;
  } else if (x == 1 && y == 4) {
    varobj.bone1 = varobj.bone11;
    varobj.bone13 = varobj.bone1313;
  } else if (x == 1 && y == 7) {
    varobj.bone1 = varobj.bone11;
    varobj.bone3 = varobj.bone33;
  } else if (x == 2 && y == 2) {
    varobj.bone6 = varobj.bone66;
    varobj.bone5 = varobj.bone55;
  } else if (x == 2 && y == 4) {
    varobj.bone6 = varobj.bone66;
    varobj.bone13 = varobj.bone1313;
  } else if (x == 2 && y == 6) {
    varobj.bone7 = varobj.bone77;
    varobj.bone6 = varobj.bone66;
  } else if (x == 3 && y == 3) {
    varobj.bone9 = varobj.bone99;
    varobj.bone10 = varobj.bone1010;
  } else if (x == 3 && y == 4) {
    varobj.bone10 = varobj.bone1010;
    varobj.bone13 = varobj.bone1313;
  } else if (x == 3 && y == 5) {
    varobj.bone111 = varobj.bone11111;
    varobj.bone10 = varobj.bone1010;
  } else if (x == 4 && y == 1) {
    varobj.bone15 = varobj.bone1515;
    varobj.bone2 = varobj.bone22;
  } else if (x == 4 && y == 2) {
    varobj.bone5 = varobj.bone55;
    varobj.bone15 = varobj.bone1515;
  } else if (x == 4 && y == 3) {
    varobj.bone9 = varobj.bone99;
    varobj.bone15 = varobj.bone1515;
  } else if (x == 4 && y == 5) {
    varobj.bone111 = varobj.bone11111;
    varobj.bone16 = varobj.bone1616;
  } else if (x == 4 && y == 6) {
    varobj.bone7 = varobj.bone77;
    varobj.bone16 = varobj.bone1616;
  } else if (x == 4 && y == 7) {
    varobj.bone3 = varobj.bone33;
    varobj.bone16 = varobj.bone1616;
  } else if (x == 5 && y == 3) {
    varobj.bone12 = varobj.bone1212;
    varobj.bone9 = varobj.bone99;
  } else if (x == 5 && y == 4) {
    varobj.bone12 = varobj.bone1212;
    varobj.bone14 = varobj.bone1414;
  } else if (x == 5 && y == 5) {
    varobj.bone12 = varobj.bone1212;
    varobj.bone111 = varobj.bone11111;
  } else if (x == 6 && y == 2) {
    varobj.bone8 = varobj.bone88;
    varobj.bone5 = varobj.bone55;
  } else if (x == 6 && y == 4) {
    varobj.bone8 = varobj.bone88;
    varobj.bone14 = varobj.bone1414;
  } else if (x == 6 && y == 6) {
    varobj.bone8 = varobj.bone88;
    varobj.bone7 = varobj.bone77;
  } else if (x == 7 && y == 1) {
    varobj.bone4 = varobj.bone44;
    varobj.bone2 = varobj.bone22;
  } else if (x == 7 && y == 4) {
    varobj.bone4 = varobj.bone44;
    varobj.bone14 = varobj.bone1414;
  } else if (x == 7 && y == 7) {
    varobj.bone4 = varobj.bone44;
    varobj.bone3 = varobj.bone33;
  }
}
