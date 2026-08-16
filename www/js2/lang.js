// Language (i18n) support for BISS
//
//   All UI labels go through msg() / msgF(), which look up `msgs` with the
//   current language. An element keeps its message key in a "data-msg"
//   attribute ("data-msg-ph" for a placeholder, "data-msg-args" for the
//   arguments of a "%s" message), so applyLanguage() can re-label the whole
//   page when the language is switched, without rebuilding the DOM and
//   without losing the data already input.
//
//   NOT translated on purpose, because they are DATA and not labels:
//     - column names and item names ("Species", "Cover", "DATE", ...)
//     - setting names ("empty", "full", "_5_layers", ...)
//     - species names, plot names, layer names
//     - option values that drive logic ('no save' in the auto save select)
//
//   The buttons inside a data table (DELETE, UPDATE_TIME_GPS) ARE translated,
//   but their English labels are kept as they are. getCellData() exports the
//   value of a button as the cell data, so a translated label would end up in
//   a saved settings JSON. That is harmless: createAllInputsTable() drops both
//   columns before the survey data is saved (so ecan::read_biss() never sees
//   them), and makeTableJO() rebuilds the buttons from the column name, not
//   from the saved value.

const LANGUAGES    = ['en', 'ja'];
const LANGUAGE_KEY = 'biss_language';
let currentLanguage = initialLanguage();

// Language to start with: the one chosen last time, else the browser's.
//    @return  A string, 'en' or 'ja'.
function initialLanguage(){
  let saved = null;
  try { saved = localStorage.getItem(LANGUAGE_KEY); } catch(e) { saved = null; }
  if(LANGUAGES.indexOf(saved) >= 0){ return saved; }
  const nav = String(window.navigator.language || 'en').split('-')[0];
  return (LANGUAGES.indexOf(nav) >= 0) ? nav : 'en';
}

// Messages in each language.
//   A message may contain HTML tags and "%s", which msgF() replaces.
const msgs = {
  // Header
  save_input      :{ en: "Save input data"                            , ja: "入力データを保存"                 },
  small           :{ en: "small"                                      , ja: "文字：小"                         },
  large           :{ en: "LARGE"                                      , ja: "文字：大"                         },
  biss            :{ en: "Biodiversity Investigation Support System (BiSS)", ja: "生物多様性調査支援システム (BiSS)" },
  screen          :{ en: "FULL SC <=> windowed"                       , ja: "フルスクリーン <=> 通常表示"      },
  show_example    :{ en: "Show example"                               , ja: "例を表示"                         },
  show_manual     :{ en: "Show manual"                                , ja: "使い方"                           },

  // Tabs
  tab_tools       :{ en: "Tools"                                      , ja: "ツール"                           },
  tab_settings    :{ en: "Settings"                                   , ja: "設定"                             },
  tab_all         :{ en: "All plots"                                  , ja: "全地点"                           },
  plus_plot       :{ en: "+ PLOT"                                     , ja: "＋ 新規地点"                      },

  // Species list module
  n_cols          :{ en: "<b>No.</b> of cols"                         , ja: "<b>表示</b>列数"                  },
  s_list          :{ en: "Species <b>list</b>"                        , ja: "種<b>一覧</b>"                    },
  include_comp    :{ en: "<b>Observed species</b>"                    , ja: "<b>出現種</b>を含める"            },
  register        :{ en: "<b>Register</b>"                            , ja: "<b>登録</b>"                      },
  delete_list     :{ en: "DELETE"                                     , ja: "削除"                             },
  del_row         :{ en: "DELETE"                                     , ja: "削除"                             },
  update_time_gps :{ en: "UPDATE_TIME_GPS"                            , ja: "日時・GPS"                        },
  input_species   :{ en: "Input species (separate with ',' , '，' or '、')", ja: "種名を入力 (「,」「，」「、」区切り)" },
  update_pl       :{ en: "Update plot and layer"                      , ja: "地点・階層を更新"                 },
  add_species_to  :{ en: "Add species to"                             , ja: "種を追加"                         },
  add_from_comp   :{ en: "Add from Composition"                       , ja: "組成から追加"                     },
  plot_label      :{ en: "PLOT"                                       , ja: "地点"                             },
  layer_label     :{ en: "Layer:"                                     , ja: "階層:"                            },
  confirm_del_sl  :{ en: "Sure to DELETE %s"                          , ja: "%s を削除します．よろしいですか？"},

  // Flora search
  replace_flora   :{ en: "Replace <b>flora</b>"                       , ja: "<b>植物相</b>の入替"              },
  search_name     :{ en: "Search %s"                                  , ja: "%s を検索"                        },
  input_text      :{ en: "Input text"                                 , ja: "種名を入力"                       },
  note_search     :{ en: ' "aaa bbb" matches texts including both "aaa" and "bbb".',
                     ja: "「aaa bbb」は，「aaa」と「bbb」の両方を含む文字列に一致します．" },
  note_wamei      :{ en: `Wamei (Japanese plant names) is obtained from <br>
                     Yamanouchi, T., Shutoh, K., Osawa, T., Yonekura, K., Kato, S., Shiga, T. 2019. <br>
                     A checklist of Japanese plant names. <br>
                     https://www.gbif.jp/v2/activities/wamei_checklist.html`,
                     ja: `和名は次の資料によります．<br>
                     山ノ内崇志・首藤光太郎・大澤剛士・米倉浩司・加藤将・志賀隆 2019. <br>
                     日本産維管束植物和名チェックリスト. <br>
                     https://www.gbif.jp/v2/activities/wamei_checklist.html` },
  alert_over_hits :{ en: "Over %s matches, showing %s matches"        , ja: "一致が %s 件を超えました．%s 件のみ表示します．" },

  // Settings tab
  interval        :{ en: "Auto save interval (min)"                   , ja: "自動保存間隔 (分)"                },
  base_setting    :{ en: "<b>Base</b> setting: "                      , ja: "<b>基本</b>設定: "                },
  add_to          :{ en: "Add to <b>%s</b>: "                         , ja: "<b>%s</b> に追加: "               },
  use_gps         :{ en: "Use GPS"                                    , ja: "GPS起動"                          },
  stop_gps        :{ en: "Stop GPS"                                   , ja: "GPS停止"                          },
  launch_mailer   :{ en: "Launch mailer"                              , ja: "メールソフト起動"                 },
  alert_email     :{ en: "Input e-mail adress!"                       , ja: "メールアドレスを入力してください．" },

  // Table module
  load            :{ en: "<b>Load: </b>"                              , ja: "<b>読込: </b>"                    },
  choose_file     :{ en: "Choose file"                                , ja: "ファイルを選ぶ"                   },
  save            :{ en: "Save"                                       , ja: "保存"                             },
  file_name       :{ en: "File name"                                  , ja: "ファイル名"                       },
  add_rows        :{ en: "Add row(s)"                                 , ja: "行を追加"                         },
  hide_table      :{ en: "Hide table"                                 , ja: "表を非表示"                       },
  show_table      :{ en: "Show table"                                 , ja: "表を表示"                         },
  new_occ_table   :{ en: "New occ table"                              , ja: "occ 表を新規作成"                 },
  fit_width       :{ en: "Fit width"                                  , ja: "幅を狭く"                         },
  extend_width    :{ en: "Extend width"                               , ja: "横長に"                           },
  search_text     :{ en: "Search text"                                , ja: "文字列検索"                       },
  hide            :{ en: "Hide"                                       , ja: "非表示"                           },
  show_label      :{ en: "Show: "                                     , ja: "表示: "                           },
  all_cols        :{ en: "All cols"                                   , ja: "全列"                             },
  calculate       :{ en: "Calculate"                                  , ja: "集計"                             },
  value_label     :{ en: "<b>Value</b>"                               , ja: "<b>値</b>"                        },
  group_label     :{ en: "<b>Group</b>"                               , ja: "<b>グループ</b>"                  },

  // Add a plot
  prompt_plot     :{ en: "Input PLOT name"                            , ja: "地点名を入力"                     },
  alert_plot_ub   :{ en: "PLOT should NOT include '_' !\n Please use '-' instead.",
                     ja: "地点名に「_」は使えません．\n「-」を使ってください．" },
  alert_plot_empty:{ en: "PLOT should NOT be empty!"                  , ja: "地点名を入力してください．"       },
  alert_plot_dup  :{ en: "%s is already exist. PLOT should NOT be DUPLICATED!",
                     ja: "%s はすでにあります．地点名は重複できません．" },
};

// Get a message in the current language.
//    Falls back to English when the message is missing or empty,
//    and to the key itself when the key is unknown.
//    @param key  A string, a key of msgs.
//    @return     A string.
function msg(key){
  const m = msgs[key];
  if(m === void 0){ return key; }
  let text = m[currentLanguage];
  if(text === void 0 || text === ''){ text = m.en; }
  return text;
}

// Get a message and replace "%s" with the given values in order.
//    @param key   A string, a key of msgs.
//    @param args  Values to embed.
//    @return      A string.
//    @examples
//    msgF('search_name', 'wamei');
function msgF(key, ...args){
  let text = msg(key);
  for(const arg of args){ text = text.replace('%s', arg); }
  return text;
}

// Create a span holding a message, which follows the language switch.
//    @param key   A string, a key of msgs.
//    @param args  Values to embed into "%s".
//    @return      A span element.
function msgSpan(key, ...args){
  const ats = { 'data-msg': key };
  if(args.length > 0){ ats['data-msg-args'] = JSON.stringify(args); }
  return crEl({ el: 'span', ih: msgF(key, ...args), ats: ats });
}

// Set a message to an element, so that it follows the language switch.
//    Use for an element whose label changes while the app is running.
//    @param el    An element.
//    @param key   A string, a key of msgs.
//    @param args  Values to embed into "%s".
function setMsg(el, key, ...args){
  el.setAttribute('data-msg', key);
  if(args.length > 0){ el.setAttribute('data-msg-args', JSON.stringify(args)); }
  applyMsgToElement(el);
}

// Helper for applyLanguage() and setMsg().
function applyMsgToElement(el){
  let args = el.getAttribute('data-msg-args');
  args = (args === null) ? [] : JSON.parse(args);
  const text = msgF(el.getAttribute('data-msg'), ...args);
  if(el.tagName === 'INPUT'){ el.value = text; } else { el.innerHTML = text; }
}

// Re-label every element that has a message key.
function applyLanguage(){
  for(const el of document.querySelectorAll('[data-msg]')){
    applyMsgToElement(el);
  }
  for(const el of document.querySelectorAll('[data-msg-ph]')){
    el.setAttribute('placeholder', msg(el.getAttribute('data-msg-ph')));
  }
  document.documentElement.setAttribute('lang', currentLanguage);
}

// Switch the language and remember it.
//   @param obj  A select element.
//                 Normally use "this".
function changeLanguage(obj){
  const lang = obj.value;
  if(LANGUAGES.indexOf(lang) < 0){ return void 0; }
  currentLanguage = lang;
  try { localStorage.setItem(LANGUAGE_KEY, lang); } catch(e) { }
  applyLanguage();
}

// Set the language select and label the page.
//   Call once, after the page is built.
function initLanguage(){
  const select = document.getElementById('select_language');
  if(select !== null){ setSelectOption(select, currentLanguage); }
  applyLanguage();
}
