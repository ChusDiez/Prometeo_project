// admin.controller.js (ejemplo)
const { supabase } = require('../helpers/supabase');

exports.getUsersScores = async (req, res) => {
  try {
    // 1) Podrías hacer una join con "users" y "exams" si quieres exam title
    // Supabase "join" style con foreign keys definidas:
    // Ej: .select('..., user:users(*), exam:exams(title)')
    const { data, error } = await supabase
      .from('exam_results')
      .select(`
        user_id,
        final_score,
        exam_id,
        users!inner ( name, email ),
        exams!inner ( title )
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // data = array con { user_id, final_score, exam_id, users: { name, email }, exams: { title } }
    // Podrías transformarlo como quieras, por ejemplo agrupar por user_id
    // ...
    return res.json({ results: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getExamsStats = async (req, res) => {
  try {
    // Ejemplo: data = [ { exam_id, p80, p70, p60, media } ... ]
    // Podrías hacer un aggregator en la BD (p80=percentile_cont(0.8), etc.)
    // Aquí supongo que ya implementaste una supabase rpc or edge function.
    const data = [
      { exam_id: 'ex-1', p80: 9.2, p70: 8.5, p60: 7.0, media: 7.5 },
      { exam_id: 'ex-2', p80: 8.0, p70: 7.5, p60: 6.0, media: 6.9 }
    ];
    // En tu caso real: data vendrá de un query a exam_results.

    return res.json({ stats: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
